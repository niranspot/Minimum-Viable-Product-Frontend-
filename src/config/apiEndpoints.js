const BASE = 'http://localhost/012-Minimum-Viable-Product/public';

export const API_BASE = BASE;

export const ENDPOINTS = {
  LOGIN:           '/login',
  LOGOUT:          '/logout',
  REGISTER:        '/register',
  REFRESH_TOKEN:   '/refresh-token',
  CHANGE_PASSWORD: '/change-password',

  // Patients (Mithra)
  PATIENTS:        '/patients',
 
  // Appointments (Mithra)
  APPOINTMENTS:    '/appointments',
 
  // Calendar (Mithra)
  CALENDAR:        '/calendar',
 
  // Dashboard (Mithra)
  DASHBOARD_SUMMARY:       '/dashboard/summary',
  DASHBOARD_APPOINTMENTS:  '/dashboard/appointments',
  DASHBOARD_PRESCRIPTIONS: '/dashboard/prescriptions',
  DASHBOARD_TENANT:        '/dashboard/tenant-analytics',
};