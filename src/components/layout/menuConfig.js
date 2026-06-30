import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MedicationIcon from '@mui/icons-material/Medication';

export const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['admin', 'doctor'],
  },
  {
    key: 'staff',
    label: 'Users & Staff',
    icon: <PeopleIcon />,
    path: '/dashboard/staff',
    roles: ['admin', 'doctor', 'nurse'],
  },
  {
    key: 'patients',
    label: 'Patients',
    icon: <PersonIcon />,
    path: '/dashboard/patients',
    roles: [ 'doctor', 'nurse'],
  },
  {
    key: 'appointments',
    label: 'Appointments',
    icon: <EventIcon />,
    path: '/dashboard/appointments',
    roles: [ 'doctor', 'nurse', 'receptionist','patient'],
  },
  {
    key: 'communication',
    label: 'Communication',
    icon: <ChatIcon />,
    path: '/dashboard/communication',
    roles: ['admin', 'doctor', 'nurse','patient'],
  },
  {
    key: 'billing',
    label: 'Billing',
    icon: <ReceiptIcon />,
    path: '/dashboard/billing',
    roles: ['admin', 'pharmacist','patient'],
  },
   {
    key: 'prescriptions',
    label: 'Prescriptions',
    icon: <MedicationIcon />,
    path: '/dashboard/prescriptions',
    roles: ['admin', 'doctor', 'pharmacist','patient'],
  },
  {
    key: 'calendar',
    label: 'Calendar',
    icon: <CalendarMonthIcon />,
    path: '/dashboard/calendar',
    roles: ['admin', 'doctor', 'receptionist'],
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: <NotificationsIcon />,
    path: '/dashboard/notifications',
    roles: ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist'],
  },
];