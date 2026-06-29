import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { user_id, role }
  isAuthenticated: false,
  loading: false,
  error: null,
  // True once the one-time startup session check (csrf + token validate/refresh)
  // has finished, regardless of outcome. ProtectedRoute waits for this before
  // deciding to redirect — otherwise it can briefly read isAuthenticated=false
  // before restoreSession's dispatch lands, flashing the login page.
  sessionChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload; // { user_id, role }
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    // Logout
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // Restore session after page refresh
    restoreSession: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    sessionCheckComplete: (state) => {
      state.sessionChecked = true;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  restoreSession,
  sessionCheckComplete,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
