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
    yield put(loginFailure(
      error.response?.data?.message || 'Login failed. Please try again.'
    ));
  }
}

function* handleLogout() {
  try {
    yield call(logoutAPI);
  } catch (_) {}
  finally {
    clearTokens();
    yield put(logoutSuccess());
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type,  handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
}