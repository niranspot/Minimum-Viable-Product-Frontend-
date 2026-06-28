import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  fetchDashboardSummaryAPI,
  fetchDashboardAppointmentsAPI,
  fetchDashboardPrescriptionsAPI,
  fetchTenantAnalyticsAPI,
} from './dashboardAPI';
import {
  fetchDashboardRequest, fetchDashboardSuccess, fetchDashboardFailure,
  fetchTenantAnalyticsRequest, fetchTenantAnalyticsSuccess, fetchTenantAnalyticsFailure,
} from './dashboardSlice';

function* handleFetchDashboard() {
  try {
    // Fetch all three in parallel
    const [summaryRes, appointmentsRes, prescriptionsRes] = yield all([
      call(fetchDashboardSummaryAPI),
      call(fetchDashboardAppointmentsAPI),
      call(fetchDashboardPrescriptionsAPI),
    ]);
    yield put(fetchDashboardSuccess({
      summary:       summaryRes.data.data,
      appointments:  appointmentsRes.data.data,
      prescriptions: prescriptionsRes.data.data,
    }));
  } catch (err) {
    yield put(fetchDashboardFailure(err.response?.data?.message || 'Failed to load dashboard'));
  }
}

function* handleFetchTenantAnalytics() {
  try {
    const res = yield call(fetchTenantAnalyticsAPI);
    yield put(fetchTenantAnalyticsSuccess(res.data.data));
  } catch (err) {
    yield put(fetchTenantAnalyticsFailure(err.response?.data?.message || 'Failed to load tenant analytics'));
  }
}

export default function* dashboardSaga() {
  yield takeLatest(fetchDashboardRequest.type,       handleFetchDashboard);
  yield takeLatest(fetchTenantAnalyticsRequest.type, handleFetchTenantAnalytics);
}