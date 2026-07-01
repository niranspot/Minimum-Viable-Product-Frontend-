import { all } from 'redux-saga/effects';

import authSaga from '../modules/auth/authSaga';
import tenantSaga from '../modules/tenant/tenantSaga';
import patientSaga      from '../modules/patients/patientSaga';
import appointmentSaga  from '../modules/appointments/appointmentSaga';
import calendarSaga     from '../modules/calendar/calendarSaga';
import dashboardSaga    from '../modules/dashboard/dashboardSaga';
import chatSaga from '../modules/chat/chatSaga';
import billingSaga from '../modules/billing/billingSaga';
import prescriptionSaga from '../modules/prescriptions/prescriptionSaga';
import staffSaga from '../modules/staff/staffSaga';
import userSaga from '../modules/users/userSaga'

export default function* rootSaga() {
  yield all([
    authSaga(),
    tenantSaga(),
    patientSaga(),
    appointmentSaga(),
    calendarSaga(),
    dashboardSaga(),
    chatSaga(),
    billingSaga(),
    prescriptionSaga(),
    staffSaga(),
    userSaga()
  ]);
}