import { takeLatest, put } from 'redux-saga/effects';
import { loginSuccess } from '../auth/authSlice';
import { setTenant } from './tenantSlice';


// After login success, load tenant info from PHP
function* handleLoadTenant(action) {
  try {
    const { tenant_id } = action.payload;

    // Optional: fetch tenant name/code from PHP if needed later
    // For now just set tenant_id from login payload
    yield put(setTenant({ tenant_id }));

  } catch (error) {
    console.error('Tenant load failed:', error);
  }
}

export default function* tenantSaga() {
  // Piggyback on loginSuccess — no extra dispatch needed
  yield takeLatest(loginSuccess.type, handleLoadTenant);
}