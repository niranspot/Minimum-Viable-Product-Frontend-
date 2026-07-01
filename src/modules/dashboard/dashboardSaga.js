import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  fetchDashboardSummaryAPI,
  fetchDashboardAppointmentsAPI,
  fetchDashboardPrescriptionsAPI,
} from './dashboardAPI';
import {
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} from './dashboardSlice';

function* handleFetchDashboard() {
  try {
    // Fetch all three in parallel
    const [summaryRes, appointmentsRes, prescriptionsRes] = yield all([
      call(fetchDashboardSummaryAPI),
      call(fetchDashboardAppointmentsAPI),
      call(fetchDashboardPrescriptionsAPI),
    ]);
    yield put(
      fetchDashboardSuccess({
        summary:       summaryRes.data.data,
        appointments:  appointmentsRes.data.data,
        prescriptions: prescriptionsRes.data.data,
      }),
    );
  } catch (err) {
    yield put(
      fetchDashboardFailure(err.response?.data?.message || 'Failed to load dashboard'),
    );
  }
}

export default function* dashboardSaga() {
  yield takeLatest(fetchDashboardRequest.type, handleFetchDashboard);
}
