import { createSlice } from '@reduxjs/toolkit';

const QUEUE_STORAGE_KEY = 'offline_appointment_queue';

const loadQueueFromStorage = () => {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveQueueToStorage = (queue) => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // storage full / unavailable — fail silently, queue still lives in memory
  }
};

const initialState = {
  list:     [],
  doctors:  [], 
  patients: [],
  loading:  false,
  error:    null,
  success:  null,

  // ---- offline queue state ----
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  queue:    loadQueueFromStorage(),   // [{ localId, payload, createdAt, status }]
  syncing:  false,
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

    // ---------------- offline queue reducers ----------------

    setNetworkStatus: (state, action) => {
      state.isOnline = action.payload;
    },

    // Called from the saga when a create happens while offline
    queueAppointment: (state, action) => {
      state.loading = false;
      const item = {
        localId:   `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        payload:   action.payload,
        createdAt: new Date().toISOString(),
        status:    'pending', // pending | syncing | failed
      };
      state.queue.push(item);
      saveQueueToStorage(state.queue);
      state.success = 'You are offline — this appointment has been saved and will be booked automatically once you\'re back online.';
    },

    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter((i) => i.localId !== action.payload);
      saveQueueToStorage(state.queue);
    },

    setQueueItemStatus: (state, action) => {
      const { localId, status } = action.payload;
      const item = state.queue.find((i) => i.localId === localId);
      if (item) item.status = status;
      saveQueueToStorage(state.queue);
    },

    syncQueueStart: (state) => { state.syncing = true; },

    syncQueueEnd: (state, action) => {
      state.syncing = false;
      if (action.payload?.syncedCount) {
        state.success = `${action.payload.syncedCount} queued appointment(s) synced successfully.`;
      }
    },
  },
});

export const {
  fetchAppointmentsRequest, fetchAppointmentsSuccess, fetchAppointmentsFailure,
  createAppointmentRequest, createAppointmentSuccess, createAppointmentFailure,
  updateAppointmentRequest, updateAppointmentSuccess, updateAppointmentFailure,
  clearAppointmentStatus,
  setNetworkStatus, queueAppointment, removeFromQueue, setQueueItemStatus,
  syncQueueStart, syncQueueEnd, fetchDropdownListsRequest, fetchDropdownListsSuccess, fetchDropdownListsFailure,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;