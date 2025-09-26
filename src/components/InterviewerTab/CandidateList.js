import React from 'react';
import { useDispatch } from 'react-redux';
import { User, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import './CandidateList.css';
import { deleteCandidate } from '../../store/candidateSlice';

const CandidateList = ({ candidates, onCandidateSelect }) => {
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString();
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="status-icon completed" />;
      case 'in-progress':
        return <Clock size={16} className="status-icon in-progress" />;
      default:
        return <AlertCircle size={16} className="status-icon pending" />;
    }
  };

  if (candidates.length === 0) {
    return (
      <div className="candidate-list-container">
        <div className="empty-state">
          <User size={48} className="empty-icon" />
          <h3>No candidates found</h3>
          <p>No candidates match your current filters. Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-list-container">
      <div className="candidate-table">
        <div className="table-header">
          <div className="header-cell">Candidate</div>
          <div className="header-cell">Score</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Date</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {candidates.map((candidate) => (
            <div 
              key={candidate.id} 
              className="table-row"
              onClick={() => onCandidateSelect(candidate.id)}
            >
              <div className="candidate-info">
                <div className="candidate-avatar">
                  <User size={20} />
                </div>
                <div className="candidate-details">
                  <span className="candidate-name">{candidate.name}</span>
                  <span className="candidate-email">{candidate.email}</span>
                </div>
              </div>

              <div className="score-cell">
                {candidate.finalScore ? (
                  <div className={`score-badge ${getScoreColor(candidate.finalScore)}`}>
                    {candidate.finalScore}
                  </div>
                ) : (
                  <span className="no-score">-</span>
                )}
              </div>

              <div className="status-cell">
                {getStatusIcon(candidate.status)}
                <span className={`status-text ${candidate.status}`}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </span>
              </div>

              <div className="date-cell">
                <div className="date-info">
                  <div className="date-line">
                    <Calendar size={12} />
                    <span>{formatDate(candidate.createdAt)}</span>
                  </div>
                  {candidate.completedAt && (
                    <div className="time-line">
                      <Clock size={12} />
                      <span>{formatTime(candidate.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="actions-cell">
                <button
                  className="view-btn"
                  onClick={(e) => { e.stopPropagation(); onCandidateSelect(candidate.id); }}
                >
                  View Details
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); dispatch(deleteCandidate(candidate.id)); }}
                  aria-label={`Delete ${candidate.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
