import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchPatientsAPI,
  createPatientAPI,
  updatePatientAPI,
  deletePatientAPI,
} from './patientAPI';
import {
  fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
  createPatientRequest, createPatientSuccess, createPatientFailure,
  updatePatientRequest, updatePatientSuccess, updatePatientFailure,
  deletePatientRequest, deletePatientSuccess, deletePatientFailure,
} from './patientSlice';

function* handleFetchPatients() {
  try {
    const res = yield call(fetchPatientsAPI);
    yield put(fetchPatientsSuccess(res.data.data));
  } catch (err) {
    yield put(fetchPatientsFailure(err.response?.data?.message || 'Failed to fetch patients'));
  }
}

function* handleCreatePatient(action) {
  try {
    yield call(createPatientAPI, action.payload);
    yield put(createPatientSuccess());
    // Refresh list after create
    yield put(fetchPatientsRequest());
  } catch (err) {
    yield put(createPatientFailure(err.response?.data?.message || 'Failed to create patient'));
  }
}

function* handleUpdatePatient(action) {
  try {
    const { id, data } = action.payload;
    yield call(updatePatientAPI, id, data);
    yield put(updatePatientSuccess());
    yield put(fetchPatientsRequest());
  } catch (err) {
    yield put(updatePatientFailure(err.response?.data?.message || 'Failed to update patient'));
  }
}

function* handleDeletePatient(action) {
  try {
    yield call(deletePatientAPI, action.payload);
    yield put(deletePatientSuccess());
    yield put(fetchPatientsRequest());
  } catch (err) {
    yield put(deletePatientFailure(err.response?.data?.message || 'Failed to delete patient'));
  }
}

export default function* patientSaga() {
  yield takeLatest(fetchPatientsRequest.type,  handleFetchPatients);
  yield takeLatest(createPatientRequest.type,  handleCreatePatient);
  yield takeLatest(updatePatientRequest.type,  handleUpdatePatient);
  yield takeLatest(deletePatientRequest.type,  handleDeletePatient);
}