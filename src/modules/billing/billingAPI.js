import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints';

// GET /billing — list bills (scoped by role on the backend: admin/doctor see all, patient sees own)
export const fetchBillingAPI = () =>
  axiosClient.get(ENDPOINTS.BILLING);

// POST /billing — generate invoice (admin, doctor)
export const createBillingAPI = (data) =>
  axiosClient.post(ENDPOINTS.BILLING, data);

// PUT /billing/{id} — update payment status (admin)
export const updateBillingStatusAPI = (id, status) =>
  axiosClient.put(ENDPOINTS.BILLING_BY_ID(id), { status });