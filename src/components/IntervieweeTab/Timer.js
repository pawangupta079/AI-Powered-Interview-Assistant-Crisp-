import React from 'react';
import { Clock, Play, Pause } from 'lucide-react';
import './Timer.css';

const Timer = ({ 
  timeRemaining, 
  isActive, 
  onPause, 
  onResume, 
  showControls = false,
  size = 'medium',
  variant = 'normal'
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerStatus = () => {
    if (timeRemaining <= 10) return 'danger';
    if (timeRemaining <= 30) return 'warning';
    return 'normal';
  };

  const getProgress = () => {
    // This would need the initial time to calculate progress
    // For now, we'll estimate based on common question times
    let estimatedInitial;
    if (timeRemaining <= 20) estimatedInitial = 20;
    else if (timeRemaining <= 60) estimatedInitial = 60;
    else estimatedInitial = 120;

    return ((estimatedInitial - timeRemaining) / estimatedInitial) * 100;
  };

  const status = getTimerStatus();
  const progress = getProgress();

  return (
    <div className={`timer-container timer-${size} timer-${variant}`}>
      <div className={`timer-display timer-${status}`}>
        {variant === 'circular' ? (
          <div className="timer-circular">
            <svg className="timer-circle" width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="36"
                className="timer-circle-bg"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                className="timer-circle-progress"
                style={{
                  strokeDasharray: 226.19,
                  strokeDashoffset: 226.19 - (progress * 226.19) / 100,
                }}
              />
            </svg>
            <div className="timer-text">
              <Clock size={16} />
              <span className="timer-time">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="timer-icon">
              <Clock size={size === 'large' ? 24 : 20} />
            </div>
            <span className="timer-time">{formatTime(timeRemaining)}</span>
            {status === 'danger' && (
              <div className="timer-pulse"></div>
            )}
          </>
        )}
      </div>

      {variant === 'linear' && (
        <div className="timer-progress-bar">
          <div 
            className="timer-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {showControls && (
        <div className="timer-controls">
          {isActive ? (
            <button
              onClick={onPause}
              className="timer-btn timer-pause"
              aria-label="Pause timer"
            >
              <Pause size={16} />
            </button>
          ) : (
            <button
              onClick={onResume}
              className="timer-btn timer-play"
              aria-label="Resume timer"
            >
              <Play size={16} />
            </button>
          )}
        </div>
      )}

      {status === 'danger' && (
        <div className="timer-warning">
          <span>Time running out!</span>
        </div>
      )}
    </div>
  );
};

export default Timer;
