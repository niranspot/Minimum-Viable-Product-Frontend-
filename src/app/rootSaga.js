import { all } from 'redux-saga/effects';

import authSaga from '../modules/auth/authSaga';
import tenantSaga from '../modules/tenant/tenantSaga';
import chatSaga from '../modules/chat/chatSaga';
import billingSaga from '../modules/billing/billingSaga';
import prescriptionSaga from '../modules/prescriptions/prescriptionSaga';
import staffSaga from '../modules/staff/staffSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    tenantSaga(),
    chatSaga(),
    billingSaga(),
    prescriptionSaga(),
    staffSaga(),
  ]);
}