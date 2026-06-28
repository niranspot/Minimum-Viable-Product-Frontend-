import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionLoading: false, // create / update / status-change / delete in flight
  actionError: null,
};

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    // Fetch list
    fetchPrescriptionsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPrescriptionsSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchPrescriptionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create
    createPrescriptionRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    createPrescriptionSuccess: (state, action) => {
      state.actionLoading = false;
      state.list.unshift(action.payload);
    },
    createPrescriptionFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Update status (verify / dispense)
    updatePrescriptionStatusRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    updatePrescriptionStatusSuccess: (state, action) => {
      state.actionLoading = false;
      const updated = action.payload;
      const idx = state.list.findIndex((p) => p.id === updated.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    updatePrescriptionStatusFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Delete
    deletePrescriptionRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    deletePrescriptionSuccess: (state, action) => {
      state.actionLoading = false;
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    deletePrescriptionFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    clearPrescriptionError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
});

export const {
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,
  createPrescriptionRequest,
  createPrescriptionSuccess,
  createPrescriptionFailure,
  updatePrescriptionStatusRequest,
  updatePrescriptionStatusSuccess,
  updatePrescriptionStatusFailure,
  deletePrescriptionRequest,
  deletePrescriptionSuccess,
  deletePrescriptionFailure,
  clearPrescriptionError,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
