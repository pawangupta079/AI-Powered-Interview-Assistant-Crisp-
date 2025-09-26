import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CandidateList from './CandidateList';
import CandidateDetails from './CandidateDetails';
import SearchBar from './SearchBar';
import { useCandidateManagement } from '../../hooks/useInterview';
import './InterviewerTab.css';

const InterviewerTab = () => {
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('finalScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const { candidates, stats } = useCandidateManagement();

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidateId(candidateId);
  };

  const handleBackToList = () => {
    setSelectedCandidateId(null);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !searchQuery || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'finalScore') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    } else if (sortBy === 'createdAt' || sortBy === 'completedAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  if (selectedCandidate) {
    return (
      <div className="interviewer-tab">
        <CandidateDetails 
          candidate={selectedCandidate}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="interviewer-tab">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Interview Dashboard</h1>
          <p>Manage and review candidate interviews</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Candidates</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.averageScore}</span>
            <span className="stat-label">Avg Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{Math.round(stats.completionRate)}%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
        </div>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />

      <CandidateList
        candidates={sortedCandidates}
        onCandidateSelect={handleCandidateSelect}
      />
    </div>
  );
};

export default InterviewerTab;
