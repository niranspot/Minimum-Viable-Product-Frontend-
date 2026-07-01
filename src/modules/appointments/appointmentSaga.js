import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchAppointmentsAPI, createAppointmentAPI, updateAppointmentAPI, fetchDoctorsAPI, fetchPatientsAPI } from './appointmentAPI';
import {
  fetchAppointmentsRequest, fetchAppointmentsSuccess, fetchAppointmentsFailure,
  createAppointmentRequest, createAppointmentSuccess, createAppointmentFailure,
  updateAppointmentRequest, updateAppointmentSuccess, updateAppointmentFailure,
  fetchDropdownListsRequest, fetchDropdownListsSuccess, fetchDropdownListsFailure
} from './appointmentSlice';

function* handleFetch() {
  try {
    const res = yield call(fetchAppointmentsAPI);
    yield put(fetchAppointmentsSuccess(res.data.data));
  } catch (err) {
    yield put(fetchAppointmentsFailure(err.response?.data?.message || 'Failed to fetch appointments'));
  }
}

function* handleCreate(action) {
  try {
    yield call(createAppointmentAPI, action.payload);
    yield put(createAppointmentSuccess());
    yield put(fetchAppointmentsRequest());
  } catch (err) {
    yield put(createAppointmentFailure(err.response?.data?.message || 'Failed to create appointment'));
  }
}

function* handleUpdate(action) {
  try {
    const { id, data } = action.payload;
    yield call(updateAppointmentAPI, id, data);
    yield put(updateAppointmentSuccess());
    yield put(fetchAppointmentsRequest());
  } catch (err) {
    yield put(updateAppointmentFailure(err.response?.data?.message || 'Failed to update appointment'));
  }
}

function* handleFetchDropdownLists(action) {
  try {
    const userRole = action.payload; // Passed from the component
    let doctors = [];
    let patients = [];

    if (userRole === 'patient') {
      // Patients only need to see the available doctors
      const docsRes = yield call(fetchDoctorsAPI);
      doctors = docsRes.data.data || docsRes.data;
    } else {
      // Doctors/Staff need to see the patient list
      const patientsRes = yield call(fetchPatientsAPI);
      patients = patientsRes.data.data || patientsRes.data;
    }

    yield put(fetchDropdownListsSuccess({ doctors, patients }));
  } catch (err) {
    yield put(fetchDropdownListsFailure(err.response?.data?.message || 'Failed to load dropdown lists'));
  }
}

export default function* appointmentSaga() {
  yield takeLatest(fetchAppointmentsRequest.type, handleFetch);
  yield takeLatest(fetchDropdownListsRequest.type, handleFetchDropdownLists);
  yield takeLatest(createAppointmentRequest.type, handleCreate);
  yield takeLatest(updateAppointmentRequest.type, handleUpdate);
}
