import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionLoading: false, // create / update / delete in flight
  actionError: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    // Fetch list
    fetchStaffRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStaffSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchStaffFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create
    createStaffRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    createStaffSuccess: (state, action) => {
      state.actionLoading = false;
      state.list.unshift(action.payload);
    },
    createStaffFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Update (specialization / status)
    updateStaffRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    updateStaffSuccess: (state, action) => {
      state.actionLoading = false;
      const updated = action.payload;
      const idx = state.list.findIndex((s) => s.id === updated.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    updateStaffFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Delete
    deleteStaffRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    deleteStaffSuccess: (state, action) => {
      state.actionLoading = false;
      state.list = state.list.filter((s) => s.id !== action.payload);
    },
    deleteStaffFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    clearStaffError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
});

export const {
  fetchStaffRequest,
  fetchStaffSuccess,
  fetchStaffFailure,
  createStaffRequest,
  createStaffSuccess,
  createStaffFailure,
  updateStaffRequest,
  updateStaffSuccess,
  updateStaffFailure,
  deleteStaffRequest,
  deleteStaffSuccess,
  deleteStaffFailure,
  clearStaffError,
} = staffSlice.actions;

export default staffSlice.reducer;