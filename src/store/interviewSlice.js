import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { generateAIScore, generateAISummary, generateAIScoreWithBreakdown } from '../utils/aiSimulator';
import { getQuestionByDifficulty, getPersonalizedQuestion } from '../utils/questionBank';

// Async thunk for processing final interview
export const processInterviewCompletion = createAsyncThunk(
  'interview/processCompletion',
  async (answers, { getState }) => {
    const { currentCandidate } = getState().interview;

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { finalScore, breakdown } = generateAIScoreWithBreakdown(answers);
    const summary = generateAISummary(answers, finalScore);

    return {
      candidateId: currentCandidate.id,
      finalScore,
      aiSummary: summary,
      completedAt: new Date().toISOString(),
      answers,
      breakdown
    };
  }
);

const initialState = {
  // Current interview session
  currentCandidate: null,
  interviewInProgress: false,
  currentQuestionIndex: 0,
  currentQuestion: null,
  currentDifficulty: 'easy',
  answers: [],
  sessionStartTime: null,
  sessionEndTime: null,

  // Timer state
  timeRemaining: 0,
  timerActive: false,

  // UI state
  isProcessing: false,
  showResults: false,
  error: null,

  // Session persistence
  sessionId: null,
  lastSaved: null,
  // Scheduling flag to safely advance questions outside reducers
  autoAdvanceAt: null,
  // Final results
  finalScore: 0,
  finalSummary: '',
  scoreBreakdown: [],
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    // Start new interview
    startInterview: (state, action) => {
      const { candidate } = action.payload;
      state.currentCandidate = candidate;
      state.interviewInProgress = true;
      state.currentQuestionIndex = 0;
      state.currentDifficulty = 'easy';
      state.answers = [];
      state.sessionStartTime = new Date().toISOString();
      state.sessionId = uuidv4();
      state.showResults = false;
      state.error = null;

      // Get first question
      const firstQuestion = getPersonalizedQuestion(candidate, 0);
      state.currentQuestion = firstQuestion;
      state.timeRemaining = firstQuestion.timeLimit;
      state.timerActive = true;

      // Save session to localStorage
      interviewSlice.caseReducers.saveSession(state);
    },

    // Load next question
    loadNextQuestion: (state) => {
      if (state.currentQuestionIndex < 5) { // 6 questions total (0-5)
        state.currentQuestionIndex += 1;

        // Determine difficulty based on question index
        let difficulty;
        if (state.currentQuestionIndex < 2) difficulty = 'easy';
        else if (state.currentQuestionIndex < 4) difficulty = 'medium';
        else difficulty = 'hard';

        state.currentDifficulty = difficulty;

        // Personalized question using candidate resume + global index
        const question = getPersonalizedQuestion(state.currentCandidate, state.currentQuestionIndex);
        state.currentQuestion = question;
        state.timeRemaining = question.timeLimit;
        state.timerActive = true;
      } else {
        // Interview completed
        state.currentQuestion = null;
        state.timerActive = false;
        state.interviewInProgress = false;
        state.sessionEndTime = new Date().toISOString();
      }

      interviewSlice.caseReducers.saveSession(state);
    },

    // Submit answer
    submitAnswer: (state, action) => {
      const { answer, timeUsed } = action.payload;

      const answerData = {
        questionIndex: state.currentQuestionIndex,
        question: state.currentQuestion?.text || '',
        answer: answer || '',
        difficulty: state.currentDifficulty,
        timeUsed,
        timeLimit: state.currentQuestion?.timeLimit || 0,
        submittedAt: new Date().toISOString(),
      };

      state.answers.push(answerData);
      state.timerActive = false;
      
      // Move to next question or complete interview
      if (state.currentQuestionIndex < 5) {
        // Schedule next question advance safely for the UI layer
        state.autoAdvanceAt = Date.now() + 1000;
      } else {
        state.interviewInProgress = false;
        state.isProcessing = true;
        // Clear the current question so it no longer shows in the UI
        state.currentQuestion = null;
        state.timeRemaining = 0;
      }

      interviewSlice.caseReducers.saveSession(state);
    },

    // Timer actions
    updateTimer: (state) => {
      if (state.timerActive && state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else if (state.timeRemaining === 0 && state.timerActive) {
        // Auto-submit when timer expires
        interviewSlice.caseReducers.submitAnswer(state, {
          payload: {
            answer: '',
            timeUsed: state.currentQuestion?.timeLimit || 0
          }
        });
      }
    },

    pauseTimer: (state) => {
      state.timerActive = false;
    },

    resumeTimer: (state) => {
      state.timerActive = true;
    },

    // Session management
    saveSession: (state) => {
      const sessionData = {
        currentCandidate: state.currentCandidate,
        interviewInProgress: state.interviewInProgress,
        currentQuestionIndex: state.currentQuestionIndex,
        currentQuestion: state.currentQuestion,
        currentDifficulty: state.currentDifficulty,
        answers: state.answers,
        sessionStartTime: state.sessionStartTime,
        sessionId: state.sessionId,
        timeRemaining: state.timeRemaining,
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem('interviewSession', JSON.stringify(sessionData));
      state.lastSaved = sessionData.lastSaved;
    },

    // Clear auto-advance scheduling flag
    clearAutoAdvance: (state) => {
      state.autoAdvanceAt = null;
    },

    resumeSession: (state, action) => {
      const sessionData = action.payload;
      Object.assign(state, {
        ...sessionData,
        timerActive: false, // Don't auto-resume timer
        isProcessing: false,
        showResults: false,
        error: null,
      });
    },

    clearSession: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem('interviewSession');
    },

    // Results
    showInterviewResults: (state) => {
      state.showResults = true;
      state.isProcessing = false;
    },

    hideResults: (state) => {
      state.showResults = false;
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
      state.isProcessing = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(processInterviewCompletion.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(processInterviewCompletion.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.showResults = true;
        state.sessionEndTime = action.payload.completedAt;
        state.finalScore = action.payload.finalScore;
        state.finalSummary = action.payload.aiSummary;
        state.scoreBreakdown = action.payload.breakdown || [];

        // Clear session data
        localStorage.removeItem('interviewSession');
      })
      .addCase(processInterviewCompletion.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.error.message || 'Failed to process interview completion';
      });
  },
});

export const {
  startInterview,
  loadNextQuestion,
  submitAnswer,
  updateTimer,
  pauseTimer,
  resumeTimer,
  saveSession,
  resumeSession,
  clearSession,
  showInterviewResults,
  hideResults,
  setError,
  clearError,
  clearAutoAdvance,
} = interviewSlice.actions;

export default interviewSlice.reducer;
