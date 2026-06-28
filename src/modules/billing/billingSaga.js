import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchBillingAPI, createBillingAPI, updateBillingStatusAPI,
} from './billingAPI';
import {
  fetchBillingRequest, fetchBillingSuccess, fetchBillingFailure,
  createBillingRequest, createBillingSuccess, createBillingFailure,
  updateBillingStatusRequest, updateBillingStatusSuccess, updateBillingStatusFailure,
} from './billingSlice';

function* handleFetchBilling() {
  try {
    const response = yield call(fetchBillingAPI);
    yield put(fetchBillingSuccess(response.data.data));
  } catch (error) {
    yield put(fetchBillingFailure(
      error.response?.data?.message || 'Failed to load billing records.'
    ));
  }
}

function* handleCreateBilling(action) {
  try {
    const response = yield call(createBillingAPI, action.payload);
    yield put(createBillingSuccess(response.data.data));
  } catch (error) {
    yield put(createBillingFailure(
      error.response?.data?.message || 'Failed to generate invoice.'
    ));
  }
}

function* handleUpdateBillingStatus(action) {
  try {
    const { id, status } = action.payload;
    const response = yield call(updateBillingStatusAPI, id, status);
    yield put(updateBillingStatusSuccess(response.data.data));
  } catch (error) {
    yield put(updateBillingStatusFailure(
      error.response?.data?.message || 'Failed to update payment status.'
    ));
  }
}

export default function* billingSaga() {
  yield takeLatest(fetchBillingRequest.type, handleFetchBilling);
  yield takeLatest(createBillingRequest.type, handleCreateBilling);
  yield takeLatest(updateBillingStatusRequest.type, handleUpdateBillingStatus);
}