import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  fetchPrescriptionsAPI,
  fetchPrescriptionsByPatientAPI,
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
    // Patients only ever see their own prescriptions. Everyone else (doctor,
    // pharmacist, admin) gets the full list. NOTE: the backend must enforce
    // this too — this is just so the patient view hits the scoped endpoint
    // instead of relying on the generic list + a client-side filter.
    const user = yield select((state) => state.auth.user);

    let records;
    if (user?.role === "patient") {
      // Adjust this field to whatever your user object actually stores —
      // could be user.patient_id, user.id, or user.profile_id depending on
      // how patient accounts are modeled on the backend.
      const patientId = user.patient_id || user.id;
      const response = yield call(fetchPrescriptionsByPatientAPI, patientId);
      records = response.data.data;
    } else {
      const response = yield call(fetchPrescriptionsAPI);
      records = response.data.data;
    }

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
