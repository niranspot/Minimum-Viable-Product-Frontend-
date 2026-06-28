import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionLoading: false, // true while creating an invoice or updating status
  actionError: null,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    // Fetch list
    fetchBillingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBillingSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchBillingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create invoice
    createBillingRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    createBillingSuccess: (state, action) => {
      state.actionLoading = false;
      state.list.unshift(action.payload);
    },
    createBillingFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Update payment status
    updateBillingStatusRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    updateBillingStatusSuccess: (state, action) => {
      state.actionLoading = false;
      const updated = action.payload;
      const idx = state.list.findIndex(
        (b) => (b.billing_id ?? b.id) === (updated.billing_id ?? updated.id),
      );
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    updateBillingStatusFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    clearBillingError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
});

export const {
  fetchBillingRequest,
  fetchBillingSuccess,
  fetchBillingFailure,
  createBillingRequest,
  createBillingSuccess,
  createBillingFailure,
  updateBillingStatusRequest,
  updateBillingStatusSuccess,
  updateBillingStatusFailure,
  clearBillingError,
} = billingSlice.actions;

export default billingSlice.reducer;
