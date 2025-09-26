import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import FileUpload from './FileUpload';
import ChatInterface from './ChatInterface';
import QuestionOverview from './QuestionOverview';
import ReportView from './ReportView';
import { useInterview } from '../../hooks/useInterview';
import { extractResumeData, getMissingFields } from '../../utils/resumeExtractor';
import toast from 'react-hot-toast';
import './IntervieweeTab.css';
import WelcomeBackModal from '../Common/WelcomeBackModal';
import ThankYouModal from '../Common/ThankYouModal';
import { resumeSession, clearSession } from '../../store/interviewSlice';

const IntervieweeTab = () => {
  const dispatch = useDispatch();
  const [uploadStep, setUploadStep] = useState('upload'); // upload, missing-fields, interview, results
  const [qaSize, setQaSize] = useState('large'); // compact | comfortable | large
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const lastQuestionKeyRef = useRef(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [pendingSession, setPendingSession] = useState(null);
  const completionAlertShownRef = useRef(false);
  const [showThanks, setShowThanks] = useState(false);

  const {
    currentCandidate,
    interviewInProgress,
    currentQuestion,
    timeRemaining,
    isTimerRunning,
    currentQuestionIndex,
    showResults,
    finalScore,
    finalSummary,
    answers,
    scoreBreakdown,
    progress,
    beginInterview,
    submitCurrentAnswer,
    pauseInterviewTimer,
    resumeInterviewTimer
  } = useInterview();

  // Add AI messages when interview state changes
  useEffect(() => {
    if (currentQuestion && chatMessages.length === 0) {
      // Add first question as AI message
      setChatMessages([{
        type: 'ai',
        text: 'Welcome to your technical interview! I\'ll be asking you 6 questions of increasing difficulty. Let\'s begin!',
        timestamp: new Date().toISOString()
      }]);
      const key = currentQuestion.id ?? `${currentQuestion.text}-${currentQuestionIndex}`;
      lastQuestionKeyRef.current = key;
    }
  }, [currentQuestion, chatMessages.length]);

  useEffect(() => {
    if (currentQuestion && lastQuestionKeyRef.current !== (currentQuestion.id ?? `${currentQuestion.text}-${currentQuestionIndex}`)) {
      setChatMessages(prev => [...prev, {
        type: 'ai',
        text: currentQuestion.text,
        timestamp: new Date().toISOString()
      }]);
      lastQuestionKeyRef.current = currentQuestion.id ?? `${currentQuestion.text}-${currentQuestionIndex}`;
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (showResults) {
      setChatMessages(prev => [...prev, {
        type: 'ai',
        text: 'Thank you for completing the interview! We will review your answers and provide feedback.',
        timestamp: new Date().toISOString()
      }]);
      // One-time alert and clear persisted session so it doesn't resume
      if (!completionAlertShownRef.current) {
        completionAlertShownRef.current = true;
        try {
          localStorage.removeItem('interviewSession');
        } catch {}
        setShowThanks(true);
        // auto-close after 3 seconds
        setTimeout(() => setShowThanks(false), 3000);
      }
    }
  }, [showResults]);

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    setUploadError('');

    try {
      const data = await extractResumeData(file);
      setExtractedData(data);

      const missing = getMissingFields(data);
      setMissingFields(missing);

      if (missing.length > 0) {
        setUploadStep('missing-fields');
        toast.success('Resume processed! Please provide missing information.');
      } else {
        startInterview(data);
      }
    } catch (error) {
      setUploadError(error.message);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Detect persisted unfinished session and show Welcome Back modal
  useEffect(() => {
    if (uploadStep !== 'upload') return;
    if (interviewInProgress) return;
    try {
      const raw = localStorage.getItem('interviewSession');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && data.currentCandidate && data.currentQuestionIndex >= 0 && !showResults) {
        setPendingSession(data);
        setShowWelcomeBack(true);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [uploadStep, interviewInProgress, showResults]);

  const handleResumeSession = () => {
    if (pendingSession) {
      dispatch(resumeSession(pendingSession));
      setUploadStep('interview');
    }
    setShowWelcomeBack(false);
  };

  const handleStartOver = () => {
    dispatch(clearSession());
    localStorage.removeItem('interviewSession');
    setPendingSession(null);
    setShowWelcomeBack(false);
  };

  const handleSkipDemo = () => {
    const demoData = {
      name: 'Demo Candidate',
      email: 'demo@example.com',
      phone: '(555) 123-4567',
      filename: 'demo-resume.pdf'
    };
    startInterview(demoData);
  };

  const startInterview = (candidateData) => {
    const completeData = {
      ...candidateData,
      ...fieldValues,
      id: uuidv4(),
      startTime: new Date().toISOString()
    };

    beginInterview(completeData);
    setUploadStep('interview');

    setChatMessages(prev => [...prev, {
      type: 'ai',
      text: `Hello ${completeData.name}! I've processed your resume and we're ready to begin. You'll have 6 questions total: 2 easy, 2 medium, and 2 hard. Good luck!`,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleMissingFieldSubmit = (e) => {
    e.preventDefault();
    const hasAllRequired = missingFields.every(field => fieldValues[field]?.trim());

    if (hasAllRequired) {
      startInterview({ ...extractedData, ...fieldValues });
    } else {
      toast.error('Please fill in all required fields.');
    }
  };

  const handleAnswerSubmit = (answer) => {
    // Add user message to chat
    setChatMessages(prev => [...prev, {
      type: 'user',
      text: answer,
      timestamp: new Date().toISOString()
    }]);

    // Submit the answer
    submitCurrentAnswer(answer);

    // Add processing message
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'ai',
        text: 'Thank you for your answer. Processing...',
        timestamp: new Date().toISOString()
      }]);
    }, 500);
  };

  // Render upload step
  if (uploadStep === 'upload') {
    return (
      <div className="interviewee-tab">
        {showWelcomeBack && (
          <WelcomeBackModal
            onContinue={handleResumeSession}
            onStartOver={handleStartOver}
            candidateName={pendingSession?.currentCandidate?.name}
            progressIndex={pendingSession?.currentQuestionIndex}
          />
        )}
        {showThanks && (
          <ThankYouModal onClose={() => setShowThanks(false)} />
        )}
        <FileUpload
          onFileUpload={handleFileUpload}
          onSkipDemo={handleSkipDemo}
          isLoading={isProcessing}
          error={uploadError}
        />
      </div>
    );
  }

  // Render missing fields step
  if (uploadStep === 'missing-fields') {
    return (
      <div className="interviewee-tab">
        {showThanks && (
          <ThankYouModal onClose={() => setShowThanks(false)} />
        )}
        <div className="missing-fields-container">
          <div className="missing-fields-header">
            <h2>Complete Your Information</h2>
            <p>We need a few more details to get started</p>
          </div>

          <form onSubmit={handleMissingFieldSubmit} className="missing-fields-form">
            {missingFields.map(field => (
              <div key={field} className="field-group">
                <label htmlFor={field} className="field-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <span className="required">*</span>
                </label>
                <input
                  id={field}
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  value={fieldValues[field] || ''}
                  onChange={(e) => setFieldValues(prev => ({
                    ...prev,
                    [field]: e.target.value
                  }))}
                  className="field-input"
                  placeholder={`Enter your ${field}`}
                  required
                />
              </div>
            ))}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg">
                Start Interview
              </button>
              <button 
                type="button" 
                onClick={() => setUploadStep('upload')}
                className="btn btn-secondary"
              >
                Back to Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Results step
  if (showResults) {
    return (
      <div className="interviewee-tab interview-active">
        {showThanks && (
          <ThankYouModal onClose={() => setShowThanks(false)} />
        )}
        <ReportView
          finalScore={finalScore}
          finalSummary={finalSummary}
          scoreBreakdown={scoreBreakdown}
          answers={answers}
          onRestart={() => {
            // End current interview session and go back to upload
            setUploadStep('upload');
          }}
        />
      </div>
    );
  }

  // Render interview step
  return (
    <div className={`interviewee-tab interview-active qa-size-${qaSize}`}>
      {showThanks && (
        <ThankYouModal onClose={() => setShowThanks(false)} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <QuestionOverview currentIndex={currentQuestionIndex} />
        <div className="qa-size-control" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <label htmlFor="qa-size" style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>View</label>
          <select
            id="qa-size"
            value={qaSize}
            onChange={(e) => setQaSize(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
      <ChatInterface
        messages={chatMessages}
        currentQuestion={currentQuestion}
        timeRemaining={timeRemaining}
        isTimerActive={isTimerRunning}
        onSubmitAnswer={handleAnswerSubmit}
        onPauseTimer={pauseInterviewTimer}
        onResumeTimer={resumeInterviewTimer}
        currentQuestionIndex={currentQuestionIndex}
      />
    </div>
  );
};

export default IntervieweeTab;
