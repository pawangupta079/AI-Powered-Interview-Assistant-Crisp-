import React from 'react';
import './ThankYouModal.css';

const ThankYouModal = ({ onClose }) => {
  return (
    <div className="ty-overlay" role="dialog" aria-modal="true" aria-labelledby="ty-title">
      <div className="ty-modal">
        <h3 id="ty-title">Thank you for the interview!</h3>
        <p className="ty-text">All the best. Your results are being prepared.</p>
        <div className="ty-actions">
          <button className="btn btn-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;
