const getBase = () => {
  const host = window.location.hostname; // e.g., 'tenant1.lvh.me' or 'lvh.me'
  const parts = host.split('.');
  const ignored = ['www', 'api', 'medicloud'];
  
  // 1. Determine if a specific tenant is currently in the URL
  const hasTenant = parts.length > 1 && !ignored.includes(parts[0]);

  // 2. Fetch environmental configuration defaults
  const protocol = process.env.REACT_APP_API_PROTOCOL || 'http://';
  const defaultBase = process.env.REACT_APP_API_DEFAULT_BASE || 'lvh.me';
  const apiPath = process.env.REACT_APP_API_PATH || '';

  // 3. Assemble the base API URL dynamically
  if (hasTenant) {
    return `${protocol}${host}${apiPath}`;
  }
  return `${protocol}${defaultBase}${apiPath}`;
};

// Export the dynamically generated base URL
export const API_BASE = getBase();

// Your exact endpoint dictionary remains beautifully untouched!
export const ENDPOINTS = {
  LOGIN:           '/login',
  LOGOUT:          '/logout',
  REGISTER:        '/register',
  REFRESH_TOKEN:   '/refresh-token',
  CHANGE_PASSWORD: '/change-password',

  // Patients
  PATIENTS:        '/patients',
  PATIENT_BY_ID:   (id) => `/patients/${id}`,

  // Appointments
  APPOINTMENTS:        '/appointments',
  APPOINTMENT_BY_ID:   (id) => `/appointments/${id}`,

  // Calendar
  CALENDAR:        '/calendar',

  // Dashboard
  DASHBOARD_SUMMARY:       '/dashboard/summary',
  DASHBOARD_APPOINTMENTS:  '/dashboard/appointments',
  DASHBOARD_PRESCRIPTIONS: '/dashboard/prescriptions',

  // Billing
  BILLING:         '/billing',              
  BILLING_BY_ID:   (id) => `/billing/${id}`, 

  // Communication
  MESSAGES:                '/messages',                                   
  MESSAGES_BY_APPOINTMENT: (appointmentId) => `/messages/${appointmentId}`, 
  MESSAGE_BY_ID:           (id) => `/messages/${id}`,

  // Prescriptions
  PRESCRIPTIONS:            '/prescriptions',                                      
  PRESCRIPTION_BY_ID:       (id) => `/prescriptions/${id}`,         
  PRESCRIPTION_STATUS:      (id) => `/prescriptions/${id}/status`, 
  PATIENT_PRESCRIPTIONS:    (patientId) => `/patients/${patientId}/prescriptions`,         
  APPOINTMENT_PRESCRIPTION: (appointmentId) => `/appointments/${appointmentId}/prescriptions`, 

  // Staff
  STAFF:         '/staff',               
  STAFF_BY_ID:   (id) => `/staff/${id}`, 

  //Endpoints
  TENANT_CONFIG:   (subdomain) => `/tenant/config?tenant=${subdomain}`,

  //Users
  USERS:           '/users',
  USER_STATUS:     (id) => `/users/${id}/status`,
  DOCTORS_LIST:    '/users/doctors',  
  PATIENTS_LIST:   '/patient/patients',
  User_PATIENTS_LIST:   '/users/patients'
};