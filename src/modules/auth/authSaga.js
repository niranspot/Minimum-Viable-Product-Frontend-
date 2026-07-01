import { call, put, takeLatest } from 'redux-saga/effects';
import { setAccessToken, setCsrfToken, clearTokens } from '../../services/axiosClient';
import { loginAPI, logoutAPI } from './authAPI';
import { decodeJWT } from '../../utils/jwtUtils';
import {
  loginRequest, loginSuccess, loginFailure,
  logoutRequest, logoutSuccess,
} from './authSlice';

function* handleLogin(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(loginAPI, email, password);
    const { access_token } = response.data.data;

    const payload = decodeJWT(access_token);
    if (!payload) throw new Error('Invalid token');

    // Store in localStorage
    setAccessToken(access_token);
    localStorage.setItem('logged', 'true');

    yield put(loginSuccess({
      user_id:   payload.user_id,
      role:      payload.role,
      tenant_id: payload.tenant_id,
    }));

  } catch (error) {
  const status  = error.response?.status;
  const message = error.response?.data?.message;

  let errorMsg = 'Login failed. Please try again.';


  if (status === 403 && message?.toLowerCase().includes('pending')) {
    errorMsg = 'Your account is pending admin approval.';
  } else if (status === 401 || message?.toLowerCase().includes('invalid')) {
    errorMsg = 'Invalid credentials';
  } else if (message) {
    errorMsg = message;
  }

  yield put(loginFailure(errorMsg));

  }
}

function* handleLogout() {
  try {
    yield call(logoutAPI);
    clearTokens();
    yield put(logoutSuccess());
  } catch (error) {
    console.error('Logout failed:', error.response?.data?.message);
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type,  handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
}