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

  // Billing
  BILLING:         '/billing',              // POST (create), GET (list)
  BILLING_BY_ID:   (id) => `/billing/${id}`, // PUT (update payment status)

  // Communication (appointment notes / messages)
  MESSAGES:                '/messages',                                  // POST (create)
  MESSAGES_BY_APPOINTMENT: (appointmentId) => `/messages/${appointmentId}`, // GET (list)

  // Prescriptions
  PRESCRIPTIONS:            '/prescriptions',                       // POST (create), GET (list)
  PRESCRIPTION_BY_ID:       (id) => `/prescriptions/${id}`,         // GET, PUT, DELETE
  PRESCRIPTION_STATUS:      (id) => `/prescriptions/${id}/status`, // PATCH (status update)
  PATIENT_PRESCRIPTIONS:    (patientId) => `/patients/${patientId}/prescriptions`,         // GET
  APPOINTMENT_PRESCRIPTION: (appointmentId) => `/appointments/${appointmentId}/prescriptions`, // GET

  // Staff
  STAFF:         '/staff',               // POST (create), GET (list)
  STAFF_BY_ID:   (id) => `/staff/${id}`, // GET, PUT (update), DELETE
};