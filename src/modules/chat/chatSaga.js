import { call, put, select, takeLatest } from "redux-saga/effects";
import { fetchMessagesAPI, sendMessageAPI } from "./chatAPI";
import {
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
} from "./chatSlice";

function* handleFetchMessages(action) {
  try {
    const appointmentId = action.payload;
    const response = yield call(fetchMessagesAPI, appointmentId);
    yield put(fetchMessagesSuccess(response.data.data));
  } catch (error) {
    yield put(
      fetchMessagesFailure(
        error.response?.data?.message || "Failed to load notes.",
      ),
    );
  }
}

function* handleSendMessage(action) {
  try {
    const { appointmentId, message } = action.payload;
    const response = yield call(sendMessageAPI, appointmentId, message);

    // The API only returns { message_id }. Build the display note locally
    // using the logged-in user's identity from the auth store.
    const authUser = yield select((state) => state.auth.user);

    const note = {
      id: response.data.data.message_id,
      appointment_id: appointmentId,
      sender_id: authUser?.user_id,
      sender_name: authUser?.name || "You",
      sender_role: authUser?.role,
      message,
      created_at: new Date().toISOString(),
    };

    yield put(sendMessageSuccess(note));
  } catch (error) {
    yield put(
      sendMessageFailure(
        error.response?.data?.message || "Failed to send note.",
      ),
    );
  }
}

export default function* chatSaga() {
  yield takeLatest(fetchMessagesRequest.type, handleFetchMessages);
  yield takeLatest(sendMessageRequest.type, handleSendMessage);
}
