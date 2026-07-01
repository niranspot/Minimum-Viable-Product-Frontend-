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
      if (!updated || updated.id === undefined || updated.id === null) return;
      // Compare loosely (string vs numeric ids from different backends), and
      // merge onto the existing record rather than requiring a full payload —
      // a partial response (e.g. just { id, status }) is exactly how a
      // "successful" PATCH can silently fail to update the visible chip color
      // if we required every field to be present.
      const idx = state.list.findIndex(
        (p) => String(p.id) === String(updated.id),
      );
      if (idx !== -1) {
        const merged = { ...state.list[idx], ...updated };
        if (typeof merged.status === "string") {
          merged.status = merged.status.toLowerCase();
        }
        state.list[idx] = merged;
      }
    },
    updatePrescriptionStatusFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Update medicines / details
    updatePrescriptionRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    updatePrescriptionSuccess: (state, action) => {
      state.actionLoading = false;
      const updated = action.payload;
      if (!updated || updated.id === undefined || updated.id === null) return;
      const idx = state.list.findIndex(
        (p) => String(p.id) === String(updated.id),
      );
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    updatePrescriptionFailure: (state, action) => {
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
  updatePrescriptionRequest,
  updatePrescriptionSuccess,
  updatePrescriptionFailure,
  deletePrescriptionRequest,
  deletePrescriptionSuccess,
  deletePrescriptionFailure,
  clearPrescriptionError,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
