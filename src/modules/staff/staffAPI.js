import axiosClient from "../../services/axiosClient";
import { ENDPOINTS } from "../../config/apiEndpoints";

// GET /staff — list staff (admin, doctor, nurse)
export const fetchStaffAPI = () => axiosClient.get(ENDPOINTS.STAFF);

// GET /staff/{id} — single staff profile (admin, doctor, nurse)
export const fetchStaffByIdAPI = (id) =>
  axiosClient.get(ENDPOINTS.STAFF_BY_ID(id));

// POST /staff — create a staff profile for an existing user (admin)
// data: { user_id, specialization }
export const createStaffAPI = (data) => axiosClient.post(ENDPOINTS.STAFF, data);

// PUT /staff/{id} — update specialization / status (admin)
// data: { specialization?, status? }
export const updateStaffAPI = (id, data) =>
  axiosClient.put(ENDPOINTS.STAFF_BY_ID(id), data);

// DELETE /staff/{id} — remove staff profile (admin)
export const deleteStaffAPI = (id) =>
  axiosClient.delete(ENDPOINTS.STAFF_BY_ID(id));