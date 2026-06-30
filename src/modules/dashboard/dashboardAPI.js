import axiosClient from '../../services/axiosClient';

export const fetchDashboardSummaryAPI     = () => axiosClient.get('/dashboard/summary');
export const fetchDashboardAppointmentsAPI = () => axiosClient.get('/dashboard/appointments');
export const fetchDashboardPrescriptionsAPI = () => axiosClient.get('/dashboard/prescriptions');