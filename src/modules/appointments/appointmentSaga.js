import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchAppointmentsAPI, createAppointmentAPI, updateAppointmentAPI } from './appointmentAPI';
import {
  fetchAppointmentsRequest, fetchAppointmentsSuccess, fetchAppointmentsFailure,
  createAppointmentRequest, createAppointmentSuccess, createAppointmentFailure,
  updateAppointmentRequest, updateAppointmentSuccess, updateAppointmentFailure,
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

export default function* appointmentSaga() {
  yield takeLatest(fetchAppointmentsRequest.type, handleFetch);
  yield takeLatest(createAppointmentRequest.type, handleCreate);
  yield takeLatest(updateAppointmentRequest.type, handleUpdate);
}