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

    // Edit a note
    updateMessageRequest: (state) => {
      state.sending = true;
      state.sendError = null;
    },
    updateMessageSuccess: (state, action) => {
      state.sending = false;
      const index = state.messages.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.messages[index].message = action.payload.message;
      }
    },
    updateMessageFailure: (state, action) => {
      state.sending = false;
      state.sendError = action.payload;
    },

    // Delete a note
    deleteMessageRequest: (state) => {
      state.error = null;
    },
    deleteMessageSuccess: (state, action) => {
      state.messages = state.messages.filter(m => m.id !== action.payload);
    },
    deleteMessageFailure: (state, action) => {
      state.error = action.payload;
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
  updateMessageRequest,
  updateMessageSuccess,
  updateMessageFailure,
  deleteMessageRequest,
  deleteMessageSuccess,
  deleteMessageFailure,
  clearChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
