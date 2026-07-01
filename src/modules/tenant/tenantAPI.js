import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints';

export const fetchTenantConfigAPI = (subdomain) =>
  axiosClient.get(ENDPOINTS.TENANT_CONFIG(subdomain));

export const updateTenantThemeAPI = (theme_settings) =>
  axiosClient.put('/tenant/theme', { theme_settings });