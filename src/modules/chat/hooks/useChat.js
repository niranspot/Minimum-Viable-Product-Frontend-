import { useDispatch, useSelector } from "react-redux";
import {
  setActiveAppointment,
  fetchMessagesRequest,
  sendMessageRequest,
  updateMessageRequest,
  deleteMessageRequest,
  clearChatError,
} from "../chatSlice";

const useChat = () => {
  const dispatch = useDispatch();
  const { activeAppointmentId, messages, loading, error, sending, sendError } =
    useSelector((state) => state.chat);

  const openAppointment = (appointmentId) => {
    dispatch(setActiveAppointment(appointmentId));
    dispatch(fetchMessagesRequest(appointmentId));
  };

  const sendMessage = (appointmentId, message) => {
    dispatch(sendMessageRequest({ appointmentId, message }));
  };

  const updateMessage = (id, message) => {
    dispatch(updateMessageRequest({ id, message }));
  };

  const deleteMessage = (id) => {
    dispatch(deleteMessageRequest(id));
  };

  const clearError = () => {
    dispatch(clearChatError());
  };

  return {
    activeAppointmentId,
    messages,
    loading,
    error,
    sending,
    sendError,
    openAppointment,
    sendMessage,
    updateMessage,
    deleteMessage,
    clearError,
  };
};

export default useChat;
