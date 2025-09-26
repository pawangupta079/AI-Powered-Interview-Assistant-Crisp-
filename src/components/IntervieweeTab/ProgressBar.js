import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import './ProgressBar.css';

const ProgressBar = ({ 
  currentStep, 
  totalSteps, 
  steps = null, 
  showLabels = true,
  variant = 'default' 
}) => {
  const defaultSteps = Array.from({ length: totalSteps }, (_, i) => ({
    id: i + 1,
    label: `Question ${i + 1}`,
    difficulty: i < 2 ? 'Easy' : i < 4 ? 'Medium' : 'Hard'
  }));

  const stepItems = steps || defaultSteps;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`progress-bar-container progress-${variant}`}>
      {showLabels && (
        <div className="progress-header">
          <span className="progress-label">Interview Progress</span>
          <span className="progress-count">
            {currentStep} of {totalSteps} questions
          </span>
        </div>
      )}

      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="progress-steps">
        {stepItems.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep + 1;
          const isPending = stepNumber > currentStep + 1;

          return (
            <div
              key={step.id || stepNumber}
              className={`progress-step ${
                isCompleted ? 'completed' : 
                isCurrent ? 'current' : 'pending'
              }`}
            >
              <div className="step-indicator">
                {isCompleted ? (
                  <CheckCircle size={20} className="step-icon completed" />
                ) : (
                  <Circle 
                    size={20} 
                    className={`step-icon ${isCurrent ? 'current' : 'pending'}`}
                  />
                )}
                <span className="step-number">{stepNumber}</span>
              </div>

              {showLabels && (
                <div className="step-content">
                  <span className="step-label">{step.label}</span>
                  <span className="step-difficulty">{step.difficulty}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-value">{currentStep}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{totalSteps - currentStep}</span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{Math.round(progress)}%</span>
          <span className="stat-label">Progress</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
