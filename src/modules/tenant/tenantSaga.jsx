import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchTenantConfigAPI }  from './tenantAPI';
import { getSubdomain }          from '../../utils/tenantUtils';
import {
  fetchTenantRequest,
  fetchTenantSuccess,
  fetchTenantFailure,
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

export default function* tenantSaga() {
  yield takeLatest(fetchTenantRequest.type, handleFetchTenant);
}