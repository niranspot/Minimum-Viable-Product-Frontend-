import { call, put, select, takeLatest } from "redux-saga/effects";
import { fetchMessagesAPI, sendMessageAPI, updateMessageAPI, deleteMessageAPI } from "./chatAPI";
import {
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
  updateMessageRequest,
  updateMessageSuccess,
  updateMessageFailure,
  deleteMessageRequest,
  deleteMessageSuccess,
  deleteMessageFailure,
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

function* handleUpdateMessage(action) {
  try {
    const { id, message } = action.payload;
    yield call(updateMessageAPI, id, message);
    
    yield put(updateMessageSuccess({ id, message }));
  } catch (error) {
    yield put(
      updateMessageFailure(
        error.response?.data?.message || "Failed to update note."
      )
    );
  }
}

function* handleDeleteMessage(action) {
  try {
    const id = action.payload;
    yield call(deleteMessageAPI, id);
    yield put(deleteMessageSuccess(id));
  } catch (error) {
    yield put(
      deleteMessageFailure(
        error.response?.data?.message || "Failed to delete note."
      )
    );
  }
}

export default function* chatSaga() {
  yield takeLatest(fetchMessagesRequest.type, handleFetchMessages);
  yield takeLatest(sendMessageRequest.type, handleSendMessage);
  yield takeLatest(updateMessageRequest.type, handleUpdateMessage);
  yield takeLatest(deleteMessageRequest.type, handleDeleteMessage);
}
