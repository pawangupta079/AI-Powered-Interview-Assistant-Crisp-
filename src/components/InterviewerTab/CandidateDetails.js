import React from 'react';
import { useDispatch } from 'react-redux';
import { User, Mail, ArrowLeft, Calendar, Clock, Award, CheckCircle, Trash2 } from 'lucide-react';
import { deleteCandidate } from '../../store/candidateSlice';

const CandidateDetails = ({ candidate, onBack }) => {
  const dispatch = useDispatch();
  if (!candidate) return null;

  const formatDate = (d) => (d ? new Date(d).toLocaleString() : 'N/A');

  return (
    <div className="candidate-details-page">
      <button onClick={onBack} className="back-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <ArrowLeft size={16} /> Back to list
      </button>

      <div className="card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ height: 40, width: 40, borderRadius: 9999, background: 'var(--color-surface-secondary)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{candidate.name || 'Unnamed'}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Mail size={12} /> {candidate.email || 'N/A'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => { dispatch(deleteCandidate(candidate.id)); onBack && onBack(); }}
              className="delete-candidate-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-error)', color: 'var(--color-white)', cursor: 'pointer' }}
            >
              <Trash2 size={16} /> Delete Candidate
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={16} />
            <span><strong>Final Score:</strong> {candidate.finalScore ?? '-'}</span>
          </div>
          <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} />
            <span><strong>Status:</strong> {candidate.status || 'N/A'}</span>
          </div>
          <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} />
            <span><strong>Created:</strong> {formatDate(candidate.createdAt)}</span>
          </div>
          <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} />
            <span><strong>Completed:</strong> {formatDate(candidate.completedAt)}</span>
          </div>
        </div>
      </div>

      {Array.isArray(candidate.answers) && candidate.answers.length > 0 && (
        <div className="qa-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, marginTop: 12 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8, color: 'var(--color-text-primary)' }}>Questions & Answers</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {candidate.answers.map((a, idx) => (
              <div key={idx} style={{ border: '1px solid var(--color-border-light)', borderRadius: 10, padding: 12, background: 'var(--color-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Q{(a.questionIndex ?? idx) + 1} · {a.difficulty || '-'}</strong>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Time: {a.timeUsed ?? 0}s / {a.timeLimit ?? 0}s</span>
                </div>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: 6 }}>Question: {a.question || '-'}</div>
                <div style={{ color: 'var(--color-text-primary)' }}>Answer: {a.answer || '-'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;
