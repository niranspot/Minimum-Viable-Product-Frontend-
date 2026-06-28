import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsIcon from '@mui/icons-material/Notifications';

export const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist'],
  },
  {
    key: 'staff',
    label: 'Users & Staff',
    icon: <PeopleIcon />,
    path: '/dashboard/staff',
    roles: ['admin'],
  },
  {
    key: 'patients',
    label: 'Patients',
    icon: <PersonIcon />,
    path: '/dashboard/patients',
    roles: [ 'doctor', 'nurse','patient'],
  },
  {
    key: 'appointments',
    label: 'Appointments',
    icon: <EventIcon />,
    path: '/dashboard/appointments',
    roles: ['admin', 'doctor', 'nurse', 'receptionist'],
  },
  {
    key: 'communication',
    label: 'Communication',
    icon: <ChatIcon />,
    path: '/dashboard/communication',
    roles: ['admin', 'doctor', 'nurse'],
  },
  {
    key: 'billing',
    label: 'Billing',
    icon: <ReceiptIcon />,
    path: '/dashboard/billing',
    roles: ['admin', 'pharmacist'],
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