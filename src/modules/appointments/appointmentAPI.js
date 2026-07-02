import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints';

// GET /appointments — list (doctor/nurse see all, patient sees own)
export const fetchAppointmentsAPI = () =>
  axiosClient.get(ENDPOINTS.APPOINTMENTS);

// POST /appointments — create
// doctor/nurse: { patient_id, doctor_id, appointment_date, notes? }
// patient:      { doctor_id, appointment_date, notes? } — patient_id auto-resolved server-side
export const createAppointmentAPI = (data) =>
  axiosClient.post(ENDPOINTS.APPOINTMENTS, data);

// PUT /appointments/{id} — update status / reschedule
// doctor/nurse: { status, appointment_date, notes? }
// patient:      { status: 'cancelled' } only
export const updateAppointmentAPI = (id, data) =>
  axiosClient.put(ENDPOINTS.APPOINTMENT_BY_ID(id), data);

//Users
export const fetchDoctorsAPI =() =>
  axiosClient.get(ENDPOINTS.DOCTORS_LIST);

export const fetchPatientsAPI =() =>
  axiosClient.get(ENDPOINTS.PATIENTS_LIST);
