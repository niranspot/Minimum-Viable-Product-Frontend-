import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchPrescriptionsAPI,
  createPrescriptionAPI,
  updatePrescriptionAPI,
  updatePrescriptionStatusAPI,
  deletePrescriptionAPI,
} from "./prescriptionAPI";
import {
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,
  createPrescriptionRequest,
  createPrescriptionSuccess,
  createPrescriptionFailure,
  updatePrescriptionRequest,
  updatePrescriptionSuccess,
  updatePrescriptionFailure,
  updatePrescriptionStatusRequest,
  updatePrescriptionStatusSuccess,
  updatePrescriptionStatusFailure,
  deletePrescriptionRequest,
  deletePrescriptionSuccess,
  deletePrescriptionFailure,
} from "./prescriptionSlice";
import { fetchDashboardRequest } from "../dashboard/dashboardSlice";

function* handleFetchPrescriptions() {
  try {
    // Use GET /prescriptions for ALL roles:
    //   - patient  → backend's getForLoggedInPatient() scopes to their own records only
    //   - doctor   → backend's getForDoctor() scopes to their own created prescriptions
    //   - pharmacist → backend returns all (read-only)
    // Do NOT call /patients/:id/prescriptions for patients — that endpoint
    // only allows doctor/pharmacist and returns 403 for the patient role.
    const response = yield call(fetchPrescriptionsAPI);
    const records = response.data.data;
    yield put(fetchPrescriptionsSuccess(records));
  } catch (error) {
    yield put(
      fetchPrescriptionsFailure(
        error.response?.data?.message || "Failed to load prescriptions.",
      ),
    );
  }
}

function* handleCreatePrescription(action) {
  try {
    const response = yield call(createPrescriptionAPI, action.payload);
    yield put(createPrescriptionSuccess(response.data.data));
    yield put(fetchDashboardRequest());
  } catch (error) {
    yield put(
      createPrescriptionFailure(
        error.response?.data?.message || "Failed to create prescription.",
      ),
    );
  }
}

function* handleUpdatePrescription(action) {
  try {
    const { id, data } = action.payload;
    const response = yield call(updatePrescriptionAPI, id, data);
    yield put(updatePrescriptionSuccess(response.data.data));
  } catch (error) {
    yield put(
      updatePrescriptionFailure(
        error.response?.data?.message || "Failed to update prescription.",
      ),
    );
  }
}

function* handleUpdatePrescriptionStatus(action) {
  try {
    const { id, status } = action.payload;
    const response = yield call(updatePrescriptionStatusAPI, id, status);

    const payload =
      response?.data?.data && response.data.data.id !== undefined
        ? response.data.data
        : { id, status };

    yield put(updatePrescriptionStatusSuccess(payload));
    yield put(fetchDashboardRequest());
  } catch (error) {
    yield put(
      updatePrescriptionStatusFailure(
        error.response?.data?.message ||
          "Failed to update prescription status.",
      ),
    );
  }
}

function* handleDeletePrescription(action) {
  try {
    const id = action.payload;
    yield call(deletePrescriptionAPI, id);
    yield put(deletePrescriptionSuccess(id));
    yield put(fetchDashboardRequest());
  } catch (error) {
    yield put(
      deletePrescriptionFailure(
        error.response?.data?.message || "Failed to delete prescription.",
      ),
    );
  }
}

export default function* prescriptionSaga() {
  yield takeLatest(fetchPrescriptionsRequest.type, handleFetchPrescriptions);
  yield takeLatest(createPrescriptionRequest.type, handleCreatePrescription);
  yield takeLatest(updatePrescriptionRequest.type, handleUpdatePrescription);
  yield takeLatest(
    updatePrescriptionStatusRequest.type,
    handleUpdatePrescriptionStatus,
  );
  yield takeLatest(deletePrescriptionRequest.type, handleDeletePrescription);
}
