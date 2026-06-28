import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints';

// GET /messages/{appointment_id} — notes for an appointment (doctor, nurse)
export const fetchMessagesAPI = (appointmentId) =>
  axiosClient.get(ENDPOINTS.MESSAGES_BY_APPOINTMENT(appointmentId));

// POST /messages — send a note tied to an appointment (doctor, nurse)
export const sendMessageAPI = (appointmentId, message) =>
  axiosClient.post(ENDPOINTS.MESSAGES, { appointment_id: appointmentId, message });