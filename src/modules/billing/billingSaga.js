import {
  call,
  put,
  take,
  fork,
  takeLatest,
  takeEvery,
  select,
  delay,
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {
  fetchBillingAPI,
  createBillingAPI,
  updateBillingStatusAPI,
} from "./billingAPI";
import {
  fetchBillingRequest,
  fetchBillingSuccess,
  fetchBillingFailure,
  createBillingRequest,
  createBillingSuccess,
  createBillingFailure,
  updateBillingStatusRequest,
  updateBillingStatusSuccess,
  updateBillingStatusFailure,
  setOnlineStatus,
  hydrateOfflineQueue,
  queueBillingItem,
  syncQueueStart,
  syncQueueItemSuccess,
  syncQueueItemFailure,
  syncQueueComplete,
  retryOfflineQueueRequest,
  removeQueuedItem,
} from "./billingSlice";
import {
  loadPersistedQueue,
  addQueueItem,
  removeQueueItem,
  genLocalId,
} from "./offlineQueueStorage";

// A failed axios request with no `response` means it never reached the
// server — that's our signal to treat the network as down, regardless of
// what navigator.onLine claims.
const isNetworkError = (error) =>
  !error.response &&
  (error.message === "Network Error" || error.code === "ERR_NETWORK");

// ── Browser online/offline events → saga ────────────────────────────────
function createNetworkChannel() {
  return eventChannel((emitter) => {
    const goOnline = () => emitter(true);
    const goOffline = () => emitter(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  });
}

function* watchNetworkStatus() {
  const channel = yield call(createNetworkChannel);
  while (true) {
    const online = yield take(channel);
    console.log("Network event fired:", online); // <-- add this

    yield put(setOnlineStatus(online));

    if (online) {
      console.log("Calling flushOfflineQueue"); // <-- add this

      yield call(flushOfflineQueue);
    }
  }
}

// ── Boot: hydrate the queue from IndexedDB, then sync if already online ──
//
// *** This is the saga change required by the move to IndexedDB. ***
// The old localStorage version could read the queue synchronously, so it
// was loaded straight into the slice's initialState. IndexedDB access is
// always asynchronous (even the "read" is a Promise), so there is no way
// to have data ready before the store is created. Instead, the app starts
// with an empty offlineQueue, and this saga — forked once at startup —
// loads the persisted queue and dispatches hydrateOfflineQueue(queue) to
// populate Redux state as soon as the IndexedDB read resolves. Any UI that
// depends on the queue being ready (e.g. showing queued invoices) should
// key off `state.billing.offlineQueueHydrated` if it needs to know when
// this has completed.
function* hydrateAndSyncOnBoot() {
  try {
    const queue = yield call(loadPersistedQueue);
    yield put(hydrateOfflineQueue(queue));
  } catch (error) {
    // loadPersistedQueue already catches internally and resolves to [],
    // so this is just an extra safety net.
    yield put(hydrateOfflineQueue([]));
  }

  const isOnline = yield select((state) => state.billing.isOnline);
  if (isOnline) {
    yield call(flushOfflineQueue);
  }
}

// ── Fetch ─────────────────────────────────────────────────────────────────
function* handleFetchBilling() {
  try {
    const response = yield call(fetchBillingAPI);
    yield put(fetchBillingSuccess(response.data.data));
  } catch (error) {
    yield put(
      fetchBillingFailure(
        error.response?.data?.message || "Failed to load billing records.",
      ),
    );
  }
}

// ── Create (online-aware) ────────────────────────────────────────────────
function* handleCreateBilling(action) {
  const isOnline = yield select((state) => state.billing.isOnline);

  if (!isOnline) {
    yield call(queueBilling, action.payload);
    return;
  }

  try {
    const response = yield call(createBillingAPI, action.payload);
    console.log("API Response:", response);

    yield put(createBillingSuccess(response.data.data));
  } catch (error) {
    if (isNetworkError(error)) {
      // We thought we were online but the request never landed — flip
      // status and fall back to queueing instead of surfacing an error.
      yield put(setOnlineStatus(false));
      yield call(queueBilling, action.payload);
    } else {
      yield put(
        createBillingFailure(
          error.response?.data?.message || "Failed to generate invoice.",
        ),
      );
    }
  }
}

function* queueBilling(data) {
  const localId = genLocalId();
  const item = {
    localId,
    data,
    queuedAt: Date.now(),
    status: "pending",
    retries: 0,
  };

  yield put(queueBillingItem({ localId, data, queuedAt: item.queuedAt }));
  // Per-item write (encrypted) — cheaper than rewriting the whole store,
  // and `addQueueItem` is a safe no-op-on-failure async call.
  yield call(addQueueItem, item);
}

// ── Flush the queue (on reconnect, on boot, or on manual retry) ─────────
function* flushOfflineQueue() {
  const queue = yield select((state) => state.billing.offlineQueue);
  if (!queue.length) return;

  yield put(syncQueueStart());

  for (const item of queue) {
    try {
      const response = yield call(createBillingAPI, item.data);
      yield put(
        syncQueueItemSuccess({
          localId: item.localId,
          record: response.data.data,
        }),
      );
      console.log("Deleting from IndexedDB:", item.localId);
      yield call(removeQueueItem, item.localId);
      console.log("Deleted from IndexedDB");
    } catch (error) {
      if (isNetworkError(error)) {
        // Lost connection again mid-sync; stop here and wait for the next
        // 'online' event rather than failing every remaining item. The
        // item stays exactly as-is in IndexedDB — nothing to persist.
        yield put(setOnlineStatus(false));
        break;
      }
      const message =
        error.response?.data?.message || "Failed to sync queued invoice.";
      yield put(
        syncQueueItemFailure({ localId: item.localId, error: message }),
      );
      // Re-persist the item with its updated status/retry count so a
      // refresh doesn't lose track of the failure.
      yield call(addQueueItem, {
        ...item,
        status: "failed",
        retries: item.retries + 1,
        error: message,
      });
    }
  }

  yield put(syncQueueComplete());
}

function* handleRetryOfflineQueue() {
  const isOnline = yield select((state) => state.billing.isOnline);
  if (isOnline) {
    yield call(flushOfflineQueue);
  }
}

// User discarded a queued invoice — keep Redux and IndexedDB in sync.
function* handleRemoveQueuedItem(action) {
  yield call(removeQueueItem, action.payload);
}

// ── Update status (requires connectivity — not queued) ───────────────────
function* handleUpdateBillingStatus(action) {
  try {
    const { id, status } = action.payload;
    const response = yield call(updateBillingStatusAPI, id, status);
    yield put(updateBillingStatusSuccess(response.data.data));
  } catch (error) {
    yield put(
      updateBillingStatusFailure(
        error.response?.data?.message || "Failed to update payment status.",
      ),
    );
  }
}

function* pollNetworkStatus() {
  while (true) {
    const browserOnline = navigator.onLine;
    const reduxOnline = yield select((state) => state.billing.isOnline);

    if (browserOnline !== reduxOnline) {
      console.log("Network status changed:", browserOnline);

      yield put(setOnlineStatus(browserOnline));

      if (browserOnline) {
        console.log("Calling flushOfflineQueue...");
        yield call(flushOfflineQueue);
      }
    }

    yield delay(3000); // Check every 3 seconds
  }
}

export default function* billingSaga() {
  yield fork(watchNetworkStatus);
  yield fork(pollNetworkStatus);
  yield fork(hydrateAndSyncOnBoot);
  yield takeLatest(fetchBillingRequest.type, handleFetchBilling);
  yield takeEvery(createBillingRequest.type, handleCreateBilling);
  yield takeEvery(updateBillingStatusRequest.type, handleUpdateBillingStatus);
  yield takeLatest(retryOfflineQueueRequest.type, handleRetryOfflineQueue);
  yield takeEvery(removeQueuedItem.type, handleRemoveQueuedItem);
}
