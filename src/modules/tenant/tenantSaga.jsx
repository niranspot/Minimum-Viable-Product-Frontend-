import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchTenantConfigAPI, updateTenantThemeAPI }  from './tenantAPI';
import { getSubdomain }          from '../../utils/tenantUtils';
import {
  fetchTenantRequest,
  fetchTenantSuccess,
  fetchTenantFailure,
  updateThemeRequest, 
  updateThemeSuccess, 
  updateThemeFailure,
} from './tenantSlice';

function* handleFetchTenant() {
  try {
    const subdomain = getSubdomain();
    if (!subdomain) return; // no tenant → main site

    const res = yield call(fetchTenantConfigAPI, subdomain);
    yield put(fetchTenantSuccess(res.data.data));

  } catch (error) {
    yield put(fetchTenantFailure(
      error.response?.data?.message || 'Failed to load tenant config'
    ));
  }

}

function* handleUpdateTheme(action) {
  try {
    const res = yield call(updateTenantThemeAPI, action.payload.theme_settings);
    yield put(updateThemeSuccess(res.data.data));
  } catch (error) {
    yield put(updateThemeFailure(error.response?.data?.message || 'Failed to update theme'));
  }
}

export default function* tenantSaga() {
  yield takeLatest(fetchTenantRequest.type, handleFetchTenant);
  yield takeLatest(updateThemeRequest.type, handleUpdateTheme);
}