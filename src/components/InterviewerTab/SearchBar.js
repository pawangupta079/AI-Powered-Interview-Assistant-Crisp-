import React from 'react';
import { Search, SortAsc, SortDesc, Filter } from 'lucide-react';

const SearchBar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  filterStatus,
  onFilterStatusChange,
}) => {
  return (
    <div className="search-bar" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <Search size={16} style={{ position: 'absolute', top: 10, left: 10, color: '#94a3b8' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email"
          style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid #e2e8f0' }}
        />
      </div>

      <div style={{ display: 'inline-flex', gap: 8 }}>
        <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <option value="finalScore">Sort: Score</option>
          <option value="createdAt">Sort: Created</option>
          <option value="completedAt">Sort: Completed</option>
        </select>

        <button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}
          aria-label="Toggle sort order"
        >
          {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
        </button>

        <select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
