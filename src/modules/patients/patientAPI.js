import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints';

// GET /patients — list all patients in tenant (doctor, nurse)
export const fetchPatientsAPI = () =>
  axiosClient.get(ENDPOINTS.PATIENTS);

// GET /patients/{id} — single patient profile (doctor, nurse)
export const fetchPatientByIdAPI = (id) =>
  axiosClient.get(ENDPOINTS.PATIENT_BY_ID(id));

// POST /patients — create a patient profile for an existing user (doctor, nurse)
// data: { user_id, blood_group?, dob?, gender?, address?, emergency_contact? }
export const createPatientAPI = (data) =>
  axiosClient.post(ENDPOINTS.PATIENTS, data);

// PUT /patients/{id} — update patient profile (doctor, nurse)
export const updatePatientAPI = (id, data) =>
  axiosClient.put(ENDPOINTS.PATIENT_BY_ID(id), data);

// DELETE /patients/{id} — soft delete (doctor, nurse)
export const deletePatientAPI = (id) =>
  axiosClient.delete(ENDPOINTS.PATIENT_BY_ID(id));

//get patients lists
export const fetchPatientsDropAPI =() =>
  axiosClient.get(ENDPOINTS.User_PATIENTS_LIST);
