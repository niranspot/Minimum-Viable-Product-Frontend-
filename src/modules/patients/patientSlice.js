import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list:    [],
  patients: [],
  current: null,
  loading: false,
  error:   null,
  success: null,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    // Fetch list
    fetchPatientsRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchPatientsSuccess: (state, action) => {
      state.loading = false;
      state.list    = action.payload;
    },
    fetchPatientsFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    // Fetch single
    fetchPatientByIdRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchPatientByIdSuccess: (state, action) => {
      state.loading = false;
      state.current = action.payload;
    },
    fetchPatientByIdFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    //patients
    fetchDropdownListsRequest: (state) => { state.loading = true; },
    fetchDropdownListsSuccess: (state, action) => {
      state.loading = false;
      state.patients = action.payload.patients;
    },
    fetchDropdownListsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create
    createPatientRequest: (state) => {
      state.loading = true;
      state.error   = null;
      state.success = null;
    },
    createPatientSuccess: (state) => {
      state.loading = false;
      state.success = 'Patient created successfully';
    },
    createPatientFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    // Update
    updatePatientRequest: (state) => {
      state.loading = true;
      state.error   = null;
      state.success = null;
    },
    updatePatientSuccess: (state) => {
      state.loading = false;
      state.success = 'Patient updated successfully';
    },
    updatePatientFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    // Delete
    deletePatientRequest: (state) => {
      state.loading = true;
      state.error   = null;
      state.success = null;
    },
    deletePatientSuccess: (state) => {
      state.loading = false;
      state.success = 'Patient deleted successfully';
    },
    deletePatientFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    clearPatientStatus: (state) => {
      state.error   = null;
      state.success = null;
    },
  },
});

export const {
  fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
  fetchPatientByIdRequest, fetchPatientByIdSuccess, fetchPatientByIdFailure,
  createPatientRequest, createPatientSuccess, createPatientFailure,
  updatePatientRequest, updatePatientSuccess, updatePatientFailure,
  deletePatientRequest, deletePatientSuccess, deletePatientFailure,
  clearPatientStatus,fetchDropdownListsRequest, fetchDropdownListsSuccess, fetchDropdownListsFailure,
} = patientSlice.actions;

export default patientSlice.reducer;