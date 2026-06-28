import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchStaffAPI,
  createStaffAPI,
  updateStaffAPI,
  deleteStaffAPI,
} from "./staffAPI";
import {
  fetchStaffRequest,
  fetchStaffSuccess,
  fetchStaffFailure,
  createStaffRequest,
  createStaffSuccess,
  createStaffFailure,
  updateStaffRequest,
  updateStaffSuccess,
  updateStaffFailure,
  deleteStaffRequest,
  deleteStaffSuccess,
  deleteStaffFailure,
} from "./staffSlice";

function* handleFetchStaff() {
  try {
    const response = yield call(fetchStaffAPI);
    yield put(fetchStaffSuccess(response.data.data));
  } catch (error) {
    yield put(
      fetchStaffFailure(
        error.response?.data?.message || "Failed to load staff list.",
      ),
    );
  }
}

function* handleCreateStaff(action) {
  try {
    const response = yield call(createStaffAPI, action.payload);
    yield put(createStaffSuccess(response.data.data));
  } catch (error) {
    yield put(
      createStaffFailure(
        error.response?.data?.message || "Failed to create staff profile.",
      ),
    );
  }
}

function* handleUpdateStaff(action) {
  try {
    const { id, data } = action.payload;
    const response = yield call(updateStaffAPI, id, data);
    yield put(updateStaffSuccess(response.data.data));
  } catch (error) {
    yield put(
      updateStaffFailure(
        error.response?.data?.message || "Failed to update staff profile.",
      ),
    );
  }
}

function* handleDeleteStaff(action) {
  try {
    const id = action.payload;
    yield call(deleteStaffAPI, id);
    yield put(deleteStaffSuccess(id));
  } catch (error) {
    yield put(
      deleteStaffFailure(
        error.response?.data?.message || "Failed to delete staff profile.",
      ),
    );
  }
}

export default function* staffSaga() {
  yield takeLatest(fetchStaffRequest.type, handleFetchStaff);
  yield takeLatest(createStaffRequest.type, handleCreateStaff);
  yield takeLatest(updateStaffRequest.type, handleUpdateStaff);
  yield takeLatest(deleteStaffRequest.type, handleDeleteStaff);
}
