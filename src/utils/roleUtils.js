export const getRoleHomePage = (role) => {
  const map = {
    admin:        '/dashboard',
    doctor:       '/dashboard/appointments',
    nurse:        '/dashboard/patients',
    receptionist: '/dashboard/calendar',
    pharmacist:   '/dashboard/billing',
    patient:      '/dashboard/appointments',
  };
  return map[role] || '/dashboard';
};

export const routePermissions = {
  '/dashboard':               ['admin','doctor'],
  '/dashboard/staff':         ['admin'],
  '/dashboard/patients':      ['admin', 'doctor', 'nurse'],
  '/dashboard/appointments':  [ 'doctor', 'nurse', 'receptionist', 'patient'],
  '/dashboard/communication': ['admin', 'doctor', 'nurse'],
  '/dashboard/billing':       ['admin', 'pharmacist', 'patient'],
  '/dashboard/prescriptions': ['admin', 'doctor', 'pharmacist', 'patient'],
  '/dashboard/calendar':      ['admin', 'doctor', 'receptionist'],
  '/dashboard/notifications': ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'patient'],
};