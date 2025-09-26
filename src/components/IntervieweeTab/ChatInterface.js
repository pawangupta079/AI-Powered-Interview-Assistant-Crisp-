import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock } from 'lucide-react';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import './ChatInterface.css';

const ChatInterface = ({ 
  messages = [],
  currentQuestion,
  timeRemaining,
  isTimerActive,
  onSubmitAnswer,
  onPauseTimer,
  onResumeTimer,
  currentQuestionIndex,
  isProcessing = false,
  showResults = false,
  finalScore = 0,
  finalSummary = ''
}) => {
  const [answer, setAnswer] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentQuestion]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim() && !isProcessing) {
      onSubmitAnswer(answer.trim());
      setAnswer('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="chat-interface">
        <div className="interview-results">
          <div className="results-header">
            <h2>Interview Complete!</h2>
            <div className="score-display">
              <span className="score-value">{finalScore}</span>
              <span className="score-label">/ 100</span>
            </div>
          </div>

          <div className="results-summary">
            <h3>AI Assessment Summary</h3>
            <p>{finalSummary}</p>
          </div>

          <div className="results-actions">
            <button className="btn btn-primary">
              View Detailed Report
            </button>
            <button className="btn btn-secondary">
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <ProgressBar 
          currentStep={currentQuestionIndex}
          totalSteps={6}
          variant="compact"
        />

        {currentQuestion && (
          <div className="question-info">
            <div className="difficulty-badge">
              {currentQuestion.difficulty || 'Medium'}
            </div>
            <Timer
              timeRemaining={timeRemaining}
              isActive={isTimerActive}
              onPause={onPauseTimer}
              onResume={onResumeTimer}
              showControls={true}
              variant="linear"
            />
          </div>
        )}
      </div>

      <div className="chat-main-panel">
        <div className="chat-messages">
          {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'ai' ? 'ai-message' : 'user-message'}`}
          >
            <div className="message-avatar">
              {message.type === 'ai' ? (
                <Bot size={20} />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.text}
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
          ))}

          {currentQuestion && (
            <div className="message ai-message current-question">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="question-header">
                  <span className="question-number">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="time-limit">
                    <Clock size={14} />
                    {formatTime(timeRemaining)} remaining
                  </span>
                </div>
                <div className="message-text question-text">
                  {currentQuestion.text}
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="message ai-message">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="processing-indicator">
                  <span>AI is evaluating your answer...</span>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here... (Press Enter to submit, Shift+Enter for new line)"
              className="chat-input"
              rows="3"
              disabled={isProcessing || !currentQuestion}
            />
            <button
              type="submit"
              className="submit-btn"
              disabled={!answer.trim() || isProcessing || !currentQuestion}
              aria-label="Submit answer"
            >
              <Send size={20} />
            </button>
          </div>

          <div className="input-footer">
            <span className="character-count">
              {answer.length} characters
            </span>
            <span className="input-hint">
              Shift+Enter for new line
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
