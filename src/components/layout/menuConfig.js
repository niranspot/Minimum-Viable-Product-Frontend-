import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MedicationIcon from '@mui/icons-material/Medication';
import SettingsIcon from '@mui/icons-material/Settings';

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
    label: 'Staffs',
    icon: <PeopleIcon />,
    path: '/dashboard/staff',
    roles: ['admin'],
  },
    {
    key: 'useractivation',
    label: 'Users Activation',
    icon: <PeopleIcon />,
    path: '/dashboard/UserStatus',
    roles: ['admin'],
  },
    {
    key: 'tenantsetting',
    label: 'Tenantsetting',
    icon: <SettingsIcon />,
    path: '/dashboard/tenantsetting',
    roles: ['admin'],
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
    roles: ['admin', 'pharmacist','patient', 'doctor'],
  },
   {
    key: 'prescriptions',
    label: 'Prescriptions',
    icon: <MedicationIcon />,
    path: '/dashboard/prescriptions',
    roles: ['doctor', 'pharmacist','patient'],
  },
  {
    key: 'calendar',
    label: 'Calendar',
    icon: <CalendarMonthIcon />,
    path: '/dashboard/calendar',
    roles: [ 'doctor', 'receptionist'],
  },

];