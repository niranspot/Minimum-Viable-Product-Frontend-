import axiosClient from "../../services/axiosClient";
import { ENDPOINTS } from "../../config/apiEndpoints";

// GET /prescriptions — list (doctor, pharmacist, admin)
export const fetchPrescriptionsAPI = () =>
  axiosClient.get(ENDPOINTS.PRESCRIPTIONS);

// POST /prescriptions — create (doctor)
export const createPrescriptionAPI = (data) =>
  axiosClient.post(ENDPOINTS.PRESCRIPTIONS, data);

// PUT /prescriptions/{id} — update medicines / details (doctor, admin)
export const updatePrescriptionAPI = (id, data) =>
  axiosClient.put(ENDPOINTS.PRESCRIPTION_BY_ID(id), data);

// PATCH /prescriptions/{id}/status — update status (doctor, pharmacist, admin)
export const updatePrescriptionStatusAPI = (id, status) =>
  axiosClient.patch(ENDPOINTS.PRESCRIPTION_STATUS(id), { status });

// DELETE /prescriptions/{id} — delete (admin, doctor)
export const deletePrescriptionAPI = (id) =>
  axiosClient.delete(ENDPOINTS.PRESCRIPTION_BY_ID(id));

// GET /patients/{id}/prescriptions — prescription history for a patient
export const fetchPrescriptionsByPatientAPI = (patientId) =>
  axiosClient.get(ENDPOINTS.PATIENT_PRESCRIPTIONS(patientId));
