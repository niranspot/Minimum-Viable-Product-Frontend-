import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events:  [],
  loading: false,
  error:   null,
  from:    null,
  to:      null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    fetchCalendarRequest: (state, action) => {
      state.loading = true;
      state.error   = null;
      state.from    = action.payload.from;
      state.to      = action.payload.to;
    },
    fetchCalendarSuccess: (state, action) => {
      state.loading = false;
      state.events  = action.payload;
    },
    fetchCalendarFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },
  },
});

export const {
  fetchCalendarRequest,
  fetchCalendarSuccess,
  fetchCalendarFailure,
} = calendarSlice.actions;

export default calendarSlice.reducer;
