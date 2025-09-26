import React from 'react';
import './QuestionOverview.css';

// Simple horizontal view of 6 questions with difficulty bands
const QuestionOverview = ({ currentIndex = 0 }) => {
  const items = [
    { idx: 0, label: 'Q1', level: 'easy' },
    { idx: 1, label: 'Q2', level: 'easy' },
    { idx: 2, label: 'Q3', level: 'medium' },
    { idx: 3, label: 'Q4', level: 'medium' },
    { idx: 4, label: 'Q5', level: 'hard' },
    { idx: 5, label: 'Q6', level: 'hard' },
  ];

  return (
    <div className="q-overview">
      {items.map(item => (
        <div
          key={item.idx}
          className={[
            'q-item',
            item.level,
            currentIndex === item.idx ? 'active' : '',
            currentIndex > item.idx ? 'completed' : '',
          ].join(' ')}
          title={`${item.label} · ${item.level}`}
        >
          <span className="q-label">{item.label}</span>
          <span className="q-level">{item.level}</span>
        </div>
      ))}
    </div>
  );
};

export default QuestionOverview;
