import axiosClient from '../../services/axiosClient';

export const fetchPatientsAPI = () =>
  axiosClient.get('/patients');

export const createPatientAPI = (data) =>
  axiosClient.post('/patients', data);

export const updatePatientAPI = (id, data) =>
  axiosClient.put(`/patients/${id}`, data);

export const deletePatientAPI = (id) =>
  axiosClient.delete(`/patients/${id}`);