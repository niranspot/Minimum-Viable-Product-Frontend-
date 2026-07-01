import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints';

// GET /dashboard/summary — total patients, appointment stats, prescription summary (admin, doctor)
export const fetchDashboardSummaryAPI = () =>
  axiosClient.get(ENDPOINTS.DASHBOARD_SUMMARY);

// GET /dashboard/appointments — appointments per day & per doctor (admin, doctor)
export const fetchDashboardAppointmentsAPI = () =>
  axiosClient.get(ENDPOINTS.DASHBOARD_APPOINTMENTS);

// GET /dashboard/prescriptions — prescription breakdown by status & doctor (admin, doctor)
export const fetchDashboardPrescriptionsAPI = () =>
  axiosClient.get(ENDPOINTS.DASHBOARD_PRESCRIPTIONS);
