import { all } from 'redux-saga/effects';
import authSaga from '../modules/auth/authSaga';
import tenantSaga from '../modules/tenant/tenantSaga';
import patientSaga      from '../modules/patients/patientSaga';
import appointmentSaga  from '../modules/appointments/appointmentSaga';
import calendarSaga     from '../modules/calendar/calendarSaga';
import dashboardSaga    from '../modules/dashboard/dashboardSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    tenantSaga(),
    patientSaga(),
    appointmentSaga(),
    calendarSaga(),
    dashboardSaga(),
  ]);
}