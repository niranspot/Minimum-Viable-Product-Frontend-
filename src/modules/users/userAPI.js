import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints'; // Adjust this relative path to match your folder setup

export const fetchUsersAPI = () =>
  axiosClient.get(ENDPOINTS.USERS);

export const updateUserStatusAPI = (id, status) =>
  axiosClient.put(ENDPOINTS.USER_STATUS(id), { status });