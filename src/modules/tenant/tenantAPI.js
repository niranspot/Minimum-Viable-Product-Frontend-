import axiosClient from '../../services/axiosClient';

export const fetchTenantConfigAPI = (subdomain) =>
  axiosClient.get(`/tenant/config?tenant=${subdomain}`);