import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints';

export const loginAPI = (email, password) =>
  axiosClient.post(ENDPOINTS.LOGIN, { email, password });

export const logoutAPI = () =>
  axiosClient.post(ENDPOINTS.LOGOUT);

export const registerAPI = (data) =>
  axiosClient.post(ENDPOINTS.REGISTER, data);

export const changePasswordAPI = (data) =>
  axiosClient.post(ENDPOINTS.CHANGE_PASSWORD, data);