import axiosClient from '../../services/axiosClient';
import { ENDPOINTS } from '../../config/apiEndpoints';

// GET /calendar?from=YYYY-MM-DD&to=YYYY-MM-DD — appointments in range, all roles
export const fetchCalendarAPI = (from, to) =>
  axiosClient.get(ENDPOINTS.CALENDAR, { params: { from, to } });
