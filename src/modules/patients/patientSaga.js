import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchPatientsAPI,
  fetchPatientByIdAPI,
  createPatientAPI,
  updatePatientAPI,
  deletePatientAPI,
  fetchPatientsDropAPI
} from './patientAPI';
import {
  fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
  fetchPatientByIdRequest, fetchPatientByIdSuccess, fetchPatientByIdFailure,
  createPatientRequest, createPatientSuccess, createPatientFailure,
  updatePatientRequest, updatePatientSuccess, updatePatientFailure,
  deletePatientRequest, deletePatientSuccess, deletePatientFailure,
  fetchDropdownListsRequest, fetchDropdownListsSuccess, fetchDropdownListsFailure
} from './patientSlice';

function* handleFetchPatients() {
  try {
    const res = yield call(fetchPatientsAPI);
    yield put(fetchPatientsSuccess(res.data.data));
  } catch (err) {
    yield put(fetchPatientsFailure(err.response?.data?.message || 'Failed to fetch patients'));
  }
}

function* handleFetchPatientById(action) {
  try {
    const res = yield call(fetchPatientByIdAPI, action.payload);
    yield put(fetchPatientByIdSuccess(res.data.data));
  } catch (err) {
    yield put(fetchPatientByIdFailure(err.response?.data?.message || 'Failed to fetch patient'));
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


function* handleFetchDropdownLists(action) {
  try {
    const userRole = action.payload; // Passed from the component
    let patients = [];
    const patientsRes = yield call(fetchPatientsDropAPI);
    patients = patientsRes.data.data || patientsRes.data;

    yield put(fetchDropdownListsSuccess({ patients }));
  } catch (err) {
    yield put(fetchDropdownListsFailure(err.response?.data?.message || 'Failed to load dropdown lists'));
  }
}


export default function* patientSaga() {
  yield takeLatest(fetchPatientsRequest.type,     handleFetchPatients);
  yield takeLatest(fetchPatientByIdRequest.type,  handleFetchPatientById);
  yield takeLatest(createPatientRequest.type,     handleCreatePatient);
  yield takeLatest(updatePatientRequest.type,     handleUpdatePatient);
  yield takeLatest(deletePatientRequest.type,     handleDeletePatient);
  yield takeLatest(fetchDropdownListsRequest.type, handleFetchDropdownLists);
}
