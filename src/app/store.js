import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from '../modules/auth/authSlice';
import tenantReducer from '../modules/tenant/tenantSlice';
import patientReducer      from '../modules/patients/patientSlice';
import appointmentReducer  from '../modules/appointments/appointmentSlice';
import calendarReducer     from '../modules/calendar/calendarSlice';
import dashboardReducer    from '../modules/dashboard/dashboardSlice';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    patients:     patientReducer,
    appointments: appointmentReducer,
    calendar:     calendarReducer,
    dashboard:    dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;