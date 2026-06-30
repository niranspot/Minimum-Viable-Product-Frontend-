import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchCalendarAPI } from './calendarAPI';
import { fetchCalendarRequest, fetchCalendarSuccess, fetchCalendarFailure } from './calendarSlice';

function* handleFetchCalendar(action) {
  try {
    const { from, to } = action.payload;
    const res = yield call(fetchCalendarAPI, from, to);
    yield put(fetchCalendarSuccess(res.data.data));
  } catch (err) {
    yield put(fetchCalendarFailure(err.response?.data?.message || 'Failed to fetch calendar'));
  }
}

export default function* calendarSaga() {
  yield takeLatest(fetchCalendarRequest.type, handleFetchCalendar);
}
