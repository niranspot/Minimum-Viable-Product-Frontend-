import axiosClient from '../../services/axiosClient';

export const fetchCalendarAPI = (from, to) =>
  axiosClient.get(`/calendar?from=${from}&to=${to}`);