import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchPrescriptionsAPI,
  createPrescriptionAPI,
  updatePrescriptionStatusAPI,
  deletePrescriptionAPI,
} from './prescriptionAPI';
import {
  fetchPrescriptionsRequest, fetchPrescriptionsSuccess, fetchPrescriptionsFailure,
  createPrescriptionRequest, createPrescriptionSuccess, createPrescriptionFailure,
  updatePrescriptionStatusRequest, updatePrescriptionStatusSuccess, updatePrescriptionStatusFailure,
  deletePrescriptionRequest, deletePrescriptionSuccess, deletePrescriptionFailure,
} from './prescriptionSlice';

function* handleFetchPrescriptions() {
  try {
    const response = yield call(fetchPrescriptionsAPI);
    yield put(fetchPrescriptionsSuccess(response.data.data));
  } catch (error) {
    yield put(fetchPrescriptionsFailure(
      error.response?.data?.message || 'Failed to load prescriptions.'
    ));
  }
}

function* handleCreatePrescription(action) {
  try {
    const response = yield call(createPrescriptionAPI, action.payload);
    yield put(createPrescriptionSuccess(response.data.data));
  } catch (error) {
    yield put(createPrescriptionFailure(
      error.response?.data?.message || 'Failed to create prescription.'
    ));
  }
}

function* handleUpdatePrescriptionStatus(action) {
  try {
    const { id, status } = action.payload;
    const response = yield call(updatePrescriptionStatusAPI, id, status);
    yield put(updatePrescriptionStatusSuccess(response.data.data));
  } catch (error) {
    yield put(updatePrescriptionStatusFailure(
      error.response?.data?.message || 'Failed to update prescription status.'
    ));
  }
}

function* handleDeletePrescription(action) {
  try {
    const id = action.payload;
    yield call(deletePrescriptionAPI, id);
    yield put(deletePrescriptionSuccess(id));
  } catch (error) {
    yield put(deletePrescriptionFailure(
      error.response?.data?.message || 'Failed to delete prescription.'
    ));
  }
}

export default function* prescriptionSaga() {
  yield takeLatest(fetchPrescriptionsRequest.type, handleFetchPrescriptions);
  yield takeLatest(createPrescriptionRequest.type, handleCreatePrescription);
  yield takeLatest(updatePrescriptionStatusRequest.type, handleUpdatePrescriptionStatus);
  yield takeLatest(deletePrescriptionRequest.type, handleDeletePrescription);
}