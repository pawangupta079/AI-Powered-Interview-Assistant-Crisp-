import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { 
  startInterview, 
  submitAnswer, 
  loadNextQuestion,
  updateTimer,
  pauseTimer,
  resumeTimer,
  clearSession,
  processInterviewCompletion, 
  clearAutoAdvance 
} from '../store/interviewSlice';
import { addCandidate, updateCandidate } from '../store/candidateSlice';
import { v4 as uuidv4 } from 'uuid';

// Custom hook for interview management
export const useInterview = () => {
  const dispatch = useDispatch();

  const {
    currentCandidate,
    interviewInProgress,
    currentQuestionIndex,
    currentQuestion,
    currentDifficulty,
    answers,
    timeRemaining,
    timerActive,
    isProcessing,
    showResults,
    sessionStartTime,
    sessionEndTime,
    error,
    autoAdvanceAt,
    finalScore,
    finalSummary,
    scoreBreakdown,
  } = useSelector(state => state.interview);

  // Start new interview with candidate data
  const beginInterview = useCallback((candidateData) => {
    const candidate = {
      ...candidateData,
      id: uuidv4(),
      startTime: new Date().toISOString(),
    };

    // Add candidate to store
    dispatch(addCandidate(candidate));

    // Start interview
    dispatch(startInterview({ candidate }));
  }, [dispatch]);

  // Submit current answer and move to next question
  const submitCurrentAnswer = useCallback((answerText) => {
    if (!currentQuestion) return;

    const timeUsed = currentQuestion.timeLimit - timeRemaining;
    dispatch(submitAnswer({ 
      answer: answerText, 
      timeUsed 
    }));
  }, [dispatch, currentQuestion, timeRemaining]);

  // Handle timer expiration (auto-submit)
  const handleTimerExpired = useCallback(() => {
    if (currentQuestion && interviewInProgress) {
      submitCurrentAnswer(''); // Submit empty answer
    }
  }, [currentQuestion, interviewInProgress, submitCurrentAnswer]);

  // Complete interview and process results
  const completeInterview = useCallback(async () => {
    if (answers.length === 6 && currentCandidate) {
      try {
        await dispatch(processInterviewCompletion(answers)).unwrap();
      } catch (error) {
        console.error('Failed to complete interview:', error);
      }
    }
  }, [dispatch, answers, currentCandidate]);

  // Timer controls
  const pauseInterviewTimer = useCallback(() => {
    dispatch(pauseTimer());
  }, [dispatch]);

  const resumeInterviewTimer = useCallback(() => {
    dispatch(resumeTimer());
  }, [dispatch]);

  // End interview early
  const endInterview = useCallback(() => {
    dispatch(clearSession());
  }, [dispatch]);

  // Get interview progress
  const getProgress = useCallback(() => {
    return {
      currentQuestion: currentQuestionIndex + 1,
      totalQuestions: 6,
      percentage: ((currentQuestionIndex + 1) / 6) * 100,
      questionsRemaining: 6 - (currentQuestionIndex + 1),
    };
  }, [currentQuestionIndex]);

  // Get time statistics
  const getTimeStats = useCallback(() => {
    if (!sessionStartTime) return null;

    const start = new Date(sessionStartTime);
    const now = new Date();
    const elapsed = Math.floor((now - start) / 1000);

    return {
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      elapsedTime: elapsed,
      formattedElapsedTime: formatDuration(elapsed),
    };
  }, [sessionStartTime, sessionEndTime]);

  // Get difficulty progression
  const getDifficultyInfo = useCallback(() => {
    const difficultyMap = {
      0: 'easy', 1: 'easy',
      2: 'medium', 3: 'medium', 
      4: 'hard', 5: 'hard'
    };

    return {
      current: currentDifficulty,
      next: difficultyMap[currentQuestionIndex + 1] || null,
      progression: [
        { level: 'Easy', questions: [0, 1], completed: currentQuestionIndex >= 1 },
        { level: 'Medium', questions: [2, 3], completed: currentQuestionIndex >= 3 },
        { level: 'Hard', questions: [4, 5], completed: currentQuestionIndex >= 5 },
      ]
    };
  }, [currentDifficulty, currentQuestionIndex]);

  // Auto-update timer
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        dispatch(updateTimer());
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && timerActive) {
      handleTimerExpired();
    }
  }, [timerActive, timeRemaining, dispatch, handleTimerExpired]);

  // Auto-complete interview when all questions answered
  useEffect(() => {
    if (answers.length === 6 && !interviewInProgress && !showResults) {
      completeInterview();
    }
  }, [answers.length, interviewInProgress, showResults, completeInterview]);

  // Safely handle scheduled auto-advance between questions
  useEffect(() => {
    if (!autoAdvanceAt) return;

    const now = Date.now();
    const delay = Math.max(0, autoAdvanceAt - now);

    const id = setTimeout(() => {
      dispatch(loadNextQuestion());
      dispatch(clearAutoAdvance());
    }, delay);

    return () => clearTimeout(id);
  }, [autoAdvanceAt, dispatch]);

  return {
    // State
    currentCandidate,
    interviewInProgress,
    currentQuestionIndex,
    currentQuestion,
    currentDifficulty,
    answers,
    timeRemaining,
    timerActive,
    isProcessing,
    showResults,
    error,
    finalScore,
    finalSummary,
    scoreBreakdown,

    // Actions
    beginInterview,
    submitCurrentAnswer,
    pauseInterviewTimer,
    resumeInterviewTimer,
    endInterview,

    // Computed values
    progress: getProgress(),
    timeStats: getTimeStats(),
    difficultyInfo: getDifficultyInfo(),

    // Status checks
    isLastQuestion: currentQuestionIndex === 5,
    isFirstQuestion: currentQuestionIndex === 0,
    canSubmit: currentQuestion && !isProcessing,
    isTimerRunning: timerActive && timeRemaining > 0,
  };
};

// Helper function to format duration
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

// Hook for candidate management
export const useCandidateManagement = () => {
  const dispatch = useDispatch();
  const { candidates, selectedCandidate, searchQuery, sortBy, sortOrder, filterStatus } = 
    useSelector(state => state.candidates);

  // Filter and sort candidates
  const getFilteredCandidates = useCallback(() => {
    let filtered = [...candidates];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        (candidate.phone && candidate.phone.includes(query))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle special cases
      if (sortBy === 'finalScore') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (sortBy === 'createdAt' || sortBy === 'completedAt') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [candidates, searchQuery, sortBy, sortOrder, filterStatus]);

  // Get candidate statistics
  const getCandidateStats = useCallback(() => {
    const total = candidates.length;
    const completed = candidates.filter(c => c.status === 'completed').length;
    const inProgress = candidates.filter(c => c.status === 'in-progress').length;

    const scores = candidates
      .filter(c => c.finalScore !== undefined)
      .map(c => c.finalScore);

    const averageScore = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;

    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    return {
      total,
      completed,
      inProgress,
      averageScore: Math.round(averageScore),
      highestScore,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [candidates]);

  return {
    candidates: getFilteredCandidates(),
    allCandidates: candidates,
    selectedCandidate,
    stats: getCandidateStats(),
    searchQuery,
    sortBy,
    sortOrder,
    filterStatus,
  };
};
