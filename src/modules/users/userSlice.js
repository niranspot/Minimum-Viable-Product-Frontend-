import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
  error: null,
  updating: null, // user id currently being updated
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStatusRequest: (state, action) => {
      state.updating = action.payload.id;
    },
    updateStatusSuccess: (state, action) => {
      state.updating = null;
      const user = state.list.find(u => u.id === action.payload.user_id);
      if (user) user.status = action.payload.status;
    },
    updateStatusFailure: (state) => {
      state.updating = null;
    },
  },
});

export const {
  fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure,
  updateStatusRequest, updateStatusSuccess, updateStatusFailure,
} = userSlice.actions;

export default userSlice.reducer;