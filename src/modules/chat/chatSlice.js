import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeAppointmentId: null,
  messages: [], // notes for the active appointment
  loading: false,
  error: null,
  sending: false,
  sendError: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveAppointment: (state, action) => {
      state.activeAppointmentId = action.payload;
      state.messages = [];
    },

    // Fetch notes for an appointment
    fetchMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    },
    fetchMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Send a note
    sendMessageRequest: (state) => {
      state.sending = true;
      state.sendError = null;
    },
    sendMessageSuccess: (state, action) => {
      state.sending = false;
      state.messages.push(action.payload);
    },
    sendMessageFailure: (state, action) => {
      state.sending = false;
      state.sendError = action.payload;
    },

    clearChatError: (state) => {
      state.error = null;
      state.sendError = null;
    },
  },
});

export const {
  setActiveAppointment,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
  clearChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
