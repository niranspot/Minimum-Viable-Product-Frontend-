import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUsersAPI, updateUserStatusAPI } from './userAPI';
import {
  fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure,
  updateStatusRequest, updateStatusSuccess, updateStatusFailure,
} from './userSlice';

function* handleFetchUsers() {
  try {
    const res = yield call(fetchUsersAPI);
    yield put(fetchUsersSuccess(res.data.data));
  } catch (error) {
    yield put(fetchUsersFailure(error.response?.data?.message || 'Failed to load users'));
  }
}

function* handleUpdateStatus(action) {
  try {
    const { id, status } = action.payload;
    const res = yield call(updateUserStatusAPI, id, status);
    yield put(updateStatusSuccess(res.data.data));
  } catch (error) {
    yield put(updateStatusFailure());
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
  yield takeLatest(updateStatusRequest.type, handleUpdateStatus);
}