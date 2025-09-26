import { createSlice } from '@reduxjs/toolkit';
import { processInterviewCompletion } from './interviewSlice';

const initialState = {
  candidates: [],
  selectedCandidate: null,
  searchQuery: '',
  sortBy: 'score', // score, name, date
  sortOrder: 'desc', // asc, desc
  filterStatus: 'all', // all, completed, in-progress
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      const candidate = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        status: 'in-progress',
      };
      state.candidates.push(candidate);
    },

    updateCandidate: (state, action) => {
      const { id, updates } = action.payload;
      const candidateIndex = state.candidates.findIndex(c => c.id === id);
      if (candidateIndex !== -1) {
        state.candidates[candidateIndex] = {
          ...state.candidates[candidateIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteCandidate: (state, action) => {
      const id = action.payload;
      state.candidates = state.candidates.filter(c => c.id !== id);
      if (state.selectedCandidate?.id === id) {
        state.selectedCandidate = null;
      }
    },

    selectCandidate: (state, action) => {
      const candidate = state.candidates.find(c => c.id === action.payload);
      state.selectedCandidate = candidate || null;
    },

    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },

    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },

    // Bulk operations
    bulkDeleteCandidates: (state, action) => {
      const idsToDelete = action.payload;
      state.candidates = state.candidates.filter(c => !idsToDelete.includes(c.id));
      if (state.selectedCandidate && idsToDelete.includes(state.selectedCandidate.id)) {
        state.selectedCandidate = null;
      }
    },

    clearAllCandidates: (state) => {
      state.candidates = [];
      state.selectedCandidate = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(processInterviewCompletion.fulfilled, (state, action) => {
      const { candidateId, finalScore, aiSummary, completedAt, answers } = action.payload;

      const candidateIndex = state.candidates.findIndex(c => c.id === candidateId);
      if (candidateIndex !== -1) {
        state.candidates[candidateIndex] = {
          ...state.candidates[candidateIndex],
          status: 'completed',
          finalScore,
          aiSummary,
          completedAt,
          answers,
          updatedAt: new Date().toISOString(),
        };
      }
    });
  },
});

export const {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  selectCandidate,
  clearSelectedCandidate,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setFilterStatus,
  bulkDeleteCandidates,
  clearAllCandidates,
} = candidateSlice.actions;

export default candidateSlice.reducer;
