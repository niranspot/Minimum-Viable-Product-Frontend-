import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summary:       null,
  appointments:  null,
  prescriptions: null,
  loading:       false,
  error:         null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.loading       = false;
      state.summary       = action.payload.summary;
      state.appointments  = action.payload.appointments;
      state.prescriptions = action.payload.prescriptions;
    },
    fetchDashboardFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },
  },
});

export const {
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
