import { createSlice } from "@reduxjs/toolkit";
import { getInitialOnlineStatus } from "./offlineQueueStorage";

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionLoading: false, // true while creating an invoice or updating status
  actionError: null,

  // ── Offline support ──────────────────────────────────────────────────
  isOnline: getInitialOnlineStatus(),
  // Starts empty: IndexedDB reads are async, so we can't hydrate this
  // synchronously here. The saga loads the persisted queue on boot and
  // dispatches hydrateOfflineQueue() to fill it in — see billingSaga.js.
  offlineQueue: [],
  offlineQueueHydrated: false, // flips true once the async boot load completes
  syncing: false, // true while flushing the offline queue after coming back online
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    // Fetch list
    fetchBillingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBillingSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchBillingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create invoice — dispatched unconditionally by the UI. The saga
    // decides whether this hits the API or gets queued for later.
    createBillingRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    createBillingSuccess: (state, action) => {
      state.actionLoading = false;
      state.list.unshift(action.payload);
    },
    createBillingFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Update payment status
    updateBillingStatusRequest: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    updateBillingStatusSuccess: (state, action) => {
      state.actionLoading = false;
      const updated = action.payload;
      const idx = state.list.findIndex(
        (b) => (b.billing_id ?? b.id) === (updated.billing_id ?? updated.id),
      );
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    updateBillingStatusFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // ── Offline queue lifecycle ──────────────────────────────────────────

    // Browser went online/offline (or a real network error told us so)
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },

    // One-time boot hydration from IndexedDB (dispatched by the saga once
    // the async load resolves). Restores both the queue and the
    // optimistic "queued" placeholders in `list` so a page refresh while
    // offline doesn't make pending invoices disappear from view.
    hydrateOfflineQueue: (state, action) => {
      const queue = action.payload || [];
      state.offlineQueue = queue;
      state.offlineQueueHydrated = true;

      queue.forEach((item) => {
        const alreadyInList = state.list.some(
          (b) => (b.billing_id ?? b.id) === item.localId,
        );
        if (!alreadyInList) {
          state.list.unshift({
            ...item.data,
            id: item.localId,
            billing_id: item.localId,
            status: "queued",
            _offline: true,
            _offlineError: item.error,
            queuedAt: item.queuedAt,
          });
        }
      });
    },

    // Invoice couldn't reach the server — park it in the queue and show
    // it optimistically in the list so the UI doesn't feel broken offline.
    queueBillingItem: (state, action) => {
      const { localId, data, queuedAt } = action.payload;
      state.actionLoading = false;
      state.offlineQueue.push({ localId, data, queuedAt, status: "pending", retries: 0 });
      state.list.unshift({
        ...data,
        id: localId,
        billing_id: localId,
        status: "queued",
        _offline: true,
        queuedAt,
      });
    },

    syncQueueStart: (state) => {
      state.syncing = true;
    },
    syncQueueItemSuccess: (state, action) => {
      const { localId, record } = action.payload;
      state.offlineQueue = state.offlineQueue.filter((q) => q.localId !== localId);
      const idx = state.list.findIndex((b) => (b.billing_id ?? b.id) === localId);
      if (idx !== -1) {
        state.list[idx] = record;
      } else {
        state.list.unshift(record);
      }
    },
    syncQueueItemFailure: (state, action) => {
      const { localId, error } = action.payload;
      const q = state.offlineQueue.find((item) => item.localId === localId);
      if (q) {
        q.status = "failed";
        q.retries += 1;
        q.error = error;
      }
      const idx = state.list.findIndex((b) => (b.billing_id ?? b.id) === localId);
      if (idx !== -1) {
        state.list[idx]._offlineError = error;
      }
    },
    syncQueueComplete: (state) => {
      state.syncing = false;
    },

    // Manual "retry sync" trigger from the UI (e.g. a button on failed items)
    retryOfflineQueueRequest: () => {},

    // Let a user discard a queued invoice they no longer want to send.
    // (The saga also removes the matching IndexedDB record — see below.)
    removeQueuedItem: (state, action) => {
      const localId = action.payload;
      state.offlineQueue = state.offlineQueue.filter((q) => q.localId !== localId);
      state.list = state.list.filter((b) => (b.billing_id ?? b.id) !== localId);
    },

    clearBillingError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
});

export const {
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
  clearBillingError,
} = billingSlice.actions;

export default billingSlice.reducer;