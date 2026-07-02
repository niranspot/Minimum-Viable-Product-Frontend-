import { call, put, take, takeLatest, select, all, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { fetchAppointmentsAPI, createAppointmentAPI, updateAppointmentAPI, fetchDoctorsAPI, fetchPatientsAPI } from './appointmentAPI';
import {
  fetchAppointmentsRequest, fetchAppointmentsSuccess, fetchAppointmentsFailure,
  createAppointmentRequest, createAppointmentSuccess, createAppointmentFailure,
  updateAppointmentRequest, updateAppointmentSuccess, updateAppointmentFailure,
  setNetworkStatus, queueAppointment, removeFromQueue, setQueueItemStatus,
  syncQueueStart, syncQueueEnd, fetchDropdownListsRequest, fetchDropdownListsSuccess, fetchDropdownListsFailure,
} from './appointmentSlice';

// ---------------------------------------------------------------------
// Network event channel — bridges native browser online/offline events
// into the saga world.
// ---------------------------------------------------------------------
function createNetworkChannel() {
  return eventChannel((emitter) => {
    const goOnline  = () => emitter(true);
    const goOffline = () => emitter(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  });
}

function* watchNetworkStatus() {
  const channel = yield call(createNetworkChannel);
  while (true) {
    const isOnline = yield take(channel);
    yield put(setNetworkStatus(isOnline));
    if (isOnline) {
      yield call(syncOfflineQueue);
    }
  }
}

// If the app is loaded while online but there are leftover queued items
// from a previous offline session (page was refreshed before syncing),
// try to sync them right away.
function* watchInitialSync() {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  yield put(setNetworkStatus(isOnline));
  if (isOnline) {
    yield call(syncOfflineQueue);
  }
}

// ---------------------------------------------------------------------
// Existing handlers
// ---------------------------------------------------------------------
function* handleFetch() {
  try {
    const res = yield call(fetchAppointmentsAPI);
    yield put(fetchAppointmentsSuccess(res.data.data));
  } catch (err) {
    yield put(fetchAppointmentsFailure(err.response?.data?.message || 'Failed to fetch appointments'));
  }
}

function* handleCreate(action) {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // OFFLINE: don't even attempt the request — straight to the queue.
  if (!isOnline) {
    yield put(queueAppointment(action.payload));
    return;
  }

  // ONLINE: normal flow.
  try {
    yield call(createAppointmentAPI, action.payload);
    yield put(createAppointmentSuccess());
    yield put(fetchAppointmentsRequest());
  } catch (err) {
    // No `err.response` means the request never reached the server
    // (DNS failure, dropped connection, etc.) — navigator.onLine can lag
    // reality, so fall back to queueing instead of losing the booking.
    if (!err.response) {
      yield put(queueAppointment(action.payload));
      return;
    }
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

// ---------------------------------------------------------------------
// Queue sync — plays queued appointments back to the server in order.
// ---------------------------------------------------------------------
function* syncOfflineQueue() {
  const queue = yield select((state) => state.appointments.queue);
  const pending = queue.filter((item) => item.status !== 'syncing');
  if (pending.length === 0) return;

  yield put(syncQueueStart());
  let syncedCount = 0;

  for (const item of pending) {
    yield put(setQueueItemStatus({ localId: item.localId, status: 'syncing' }));
    try {
      yield call(createAppointmentAPI, item.payload);
      yield put(removeFromQueue(item.localId));
      syncedCount += 1;
    } catch (err) {
      // Keep it in the queue for the next sync attempt.
      yield put(setQueueItemStatus({ localId: item.localId, status: 'failed' }));
    }
  }

  yield put(syncQueueEnd({ syncedCount }));
  yield put(fetchAppointmentsRequest());
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
  yield all([
    fork(watchInitialSync),
    fork(watchNetworkStatus),
    takeLatest(fetchAppointmentsRequest.type, handleFetch),
    takeLatest(createAppointmentRequest.type, handleCreate),
    takeLatest(updateAppointmentRequest.type, handleUpdate),
    takeLatest(fetchDropdownListsRequest.type, handleFetchDropdownLists),
  ]);
}