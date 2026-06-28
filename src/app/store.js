import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import authReducer from '../modules/auth/authSlice';
import tenantReducer from '../modules/tenant/tenantSlice';
import chatReducer from '../modules/chat/chatSlice';
import billingReducer from '../modules/billing/billingSlice';
import prescriptionsReducer from '../modules/prescriptions/prescriptionSlice';
import staffReducer from '../modules/staff/staffSlice';

import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    chat: chatReducer,
    billing: billingReducer,
    prescriptions: prescriptionsReducer,
    staff: staffReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;