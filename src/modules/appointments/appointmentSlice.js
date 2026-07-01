import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list:     [],
  doctors:  [], // <── Added
  patients: [],
  loading: false,
  error:   null,
  success: null,

};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    fetchAppointmentsRequest: (state) => { state.loading = true;  state.error = null; },
    fetchAppointmentsSuccess: (state, action) => { state.loading = false; state.list = action.payload; },
    fetchAppointmentsFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    createAppointmentRequest: (state) => { state.loading = true; state.error = null; state.success = null; },
    createAppointmentSuccess: (state) => { state.loading = false; state.success = 'Appointment created successfully'; },
    createAppointmentFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    updateAppointmentRequest: (state) => { state.loading = true; state.error = null; state.success = null; },
    updateAppointmentSuccess: (state) => { state.loading = false; state.success = 'Appointment updated successfully'; },
    updateAppointmentFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    fetchDropdownListsRequest: (state) => { state.loading = true; },
    fetchDropdownListsSuccess: (state, action) => {
      state.loading = false;
      state.doctors = action.payload.doctors;
      state.patients = action.payload.patients;
    },
    fetchDropdownListsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearAppointmentStatus: (state) => { state.error = null; state.success = null; },
  },
});

export const {
  fetchAppointmentsRequest, fetchAppointmentsSuccess, fetchAppointmentsFailure,
  createAppointmentRequest, createAppointmentSuccess, createAppointmentFailure,
  updateAppointmentRequest, updateAppointmentSuccess, updateAppointmentFailure,
  clearAppointmentStatus,fetchDropdownListsRequest, fetchDropdownListsSuccess, fetchDropdownListsFailure,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
