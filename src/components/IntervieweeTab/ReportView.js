import React from 'react';
import './ReportView.css';

const ReportView = ({ finalScore = 0, finalSummary = '', scoreBreakdown = [], answers = [] }) => {
  return (
    <div className="report-view">
      <div className="report-card">
        <div className="report-header">
          <h2>Interview Report</h2>
          <div className="score-badge" aria-label={`Final score ${finalScore} out of 100`}>
            <span className="score-value">{finalScore}</span>
            <span className="score-total">/ 100</span>
          </div>
        </div>

        <div className="report-section">
          <h3>AI Assessment Summary</h3>
          <p className="summary-text">{finalSummary || 'Summary will appear here.'}</p>
        </div>

        {scoreBreakdown?.length > 0 && (
          <div className="report-section">
            <h3>Score Breakdown</h3>
            <div className="breakdown-grid">
              {scoreBreakdown.map((b) => (
                <div key={b.index} className="breakdown-item">
                  <div className="bd-title">Q{b.index + 1} · {b.difficulty}</div>
                  <div className="bd-score">{b.score}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(answers) && answers.length > 0 && (
          <div className="report-section">
            <h3>Your Answers</h3>
            <div className="answers-list">
              {answers.map((a, idx) => (
                <div key={idx} className="answer-card">
                  <div className="answer-header">
                    <strong>Q{(a.questionIndex ?? idx) + 1} · {a.difficulty}</strong>
                    <span className="meta">Time: {a.timeUsed ?? 0}s / {a.timeLimit ?? 0}s</span>
                  </div>
                  <div className="q-text">{a.question}</div>
                  <div className="a-text">{a.answer || '(no answer provided)'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="report-actions">
          <button className="btn btn-primary">Download PDF</button>
          <button className="btn btn-outline">Start New Interview</button>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
