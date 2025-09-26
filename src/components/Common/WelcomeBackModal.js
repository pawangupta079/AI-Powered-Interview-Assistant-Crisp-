import React from 'react';
import './WelcomeBackModal.css';

const WelcomeBackModal = ({ onContinue, onStartOver, candidateName, progressIndex }) => {
  return (
    <div className="wb-overlay" role="dialog" aria-modal="true" aria-labelledby="wb-title">
      <div className="wb-modal">
        <h3 id="wb-title">Welcome Back{candidateName ? `, ${candidateName}` : ''}!</h3>
        <p className="wb-subtitle">We found an unfinished interview.</p>
        <div className="wb-body">
          <div className="wb-status">
            <span className="wb-chip">Progress: Question {typeof progressIndex === 'number' ? progressIndex + 1 : 1} of 6</span>
          </div>
          <p className="wb-text">Would you like to continue where you left off, or start a new interview?</p>
        </div>
        <div className="wb-actions">
          <button className="btn btn-secondary" onClick={onStartOver}>Start Over</button>
          <button className="btn btn-primary" onClick={onContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;
