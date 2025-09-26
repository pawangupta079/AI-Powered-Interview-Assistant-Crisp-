import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TabNavigation from './components/Common/TabNavigation';
import IntervieweeTab from './components/IntervieweeTab/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab/InterviewerTab';
import Modal from './components/Common/Modal';
import { resumeSession, clearSession } from './store/interviewSlice';
import './App.css';
import './styles/variables.css';
import toast from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('interviewee');
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const dispatch = useDispatch();

  const { 
    currentCandidate, 
    interviewInProgress, 
    currentQuestionIndex,
    sessionData 
  } = useSelector((state) => state.interview);

  useEffect(() => {
    // Check for incomplete session on app load
    const savedSession = localStorage.getItem('interviewSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.interviewInProgress && !session.completed) {
          setShowWelcomeBack(true);
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('interviewSession');
      }
    }
  }, []);

  const handleResumeSession = () => {
    const savedSession = localStorage.getItem('interviewSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        dispatch(resumeSession(session));
        setShowWelcomeBack(false);
        setActiveTab('interviewee');
        toast.success('Welcome back! Your interview has been resumed.');
      } catch (error) {
        console.error('Error resuming session:', error);
        toast.error('Failed to resume session. Starting fresh.');
        handleStartFresh();
      }
    }
  };

  const handleStartFresh = () => {
    dispatch(clearSession());
    localStorage.removeItem('interviewSession');
    setShowWelcomeBack(false);
    toast.success('Starting a fresh interview session.');
  };

  const tabs = [
    {
      id: 'interviewee',
      label: 'Interviewee',
      icon: 'MessageSquare',
      description: 'Chat interface for candidates'
    },
    {
      id: 'interviewer',
      label: 'Interviewer',
      icon: 'Users',
      description: 'Dashboard for managing candidates'
    }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-title">
            <h1>AI Interview Assistant</h1>
            <span className="app-subtitle">
              Powered by advanced AI for seamless interviews
            </span>
          </div>

          {interviewInProgress && activeTab === 'interviewee' && (
            <div className="interview-status">
              <div className="status-indicator active"></div>
              <span>Interview in progress</span>
              <span className="question-counter">
                Question {currentQuestionIndex + 1} of 6
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="app-container">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="app-content">
            {activeTab === 'interviewee' && <IntervieweeTab />}
            {activeTab === 'interviewer' && <InterviewerTab />}
          </div>
        </div>
      </main>

      {showWelcomeBack && (
        <Modal
          isOpen={showWelcomeBack}
          onClose={handleStartFresh}
          title="Welcome Back!"
          className="welcome-back-modal"
        >
          <div className="welcome-back-content">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="welcome-text">
              {currentCandidate?.name ? (
                <p>
                  Hi <strong>{currentCandidate.name}</strong>! We found your incomplete 
                  interview session. You were on question{' '}
                  <strong>{currentQuestionIndex + 1}</strong> of 6.
                </p>
              ) : (
                <p>
                  We found an incomplete interview session. Would you like to 
                  continue where you left off?
                </p>
              )}
            </div>

            <div className="welcome-actions">
              <button
                onClick={handleResumeSession}
                className="btn btn-primary btn-lg"
              >
                Resume Interview
              </button>
              <button
                onClick={handleStartFresh}
                className="btn btn-secondary btn-lg"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </Modal>
      )}

      <footer className="app-footer">
        <div className="app-footer-content">
          <p>© 2025 AI Interview Assistant. Built for Swipe Internship Assignment.</p>
          <div className="footer-links">
            <span>Made with ❤️ using React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
