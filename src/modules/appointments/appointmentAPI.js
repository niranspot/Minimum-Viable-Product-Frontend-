import axiosClient from '../../services/axiosClient';

export const fetchAppointmentsAPI = () =>
  axiosClient.get('/appointments');

export const createAppointmentAPI = (data) =>
  axiosClient.post('/appointments', data);

export const updateAppointmentAPI = (id, data) =>
  axiosClient.put(`/appointments/${id}`, data);