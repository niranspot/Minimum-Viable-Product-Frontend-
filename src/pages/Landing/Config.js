import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckIcon         from '@mui/icons-material/Check';
import ArrowForwardIcon  from '@mui/icons-material/ArrowForward';
import PeopleIcon        from '@mui/icons-material/People';
import CalendarIcon      from '@mui/icons-material/CalendarMonth';
import ReceiptIcon       from '@mui/icons-material/Receipt';
import SecurityIcon      from '@mui/icons-material/Security';
import SpeedIcon         from '@mui/icons-material/Speed';
import CloudIcon         from '@mui/icons-material/Cloud'; 


export const plans = [
  {
    name:     'Basic',
    value:    'basic',
    price:    '₹999',
    period:   'per month',
    desc:     'Perfect for small clinics and solo practitioners.',
    featured: false,
    features: [
      'Up to 5 Staff Members',
      'Patient Management',
      'Appointment Scheduling',
      'Basic Billing',
      'Email Support',
    ],
  },
  {
    name:     'Pro',
    value:    'pro',
    price:    '₹2,499',
    period:   'per month',
    desc:     'Ideal for growing hospitals and multi-specialty clinics.',
    featured: true,
    features: [
      'Up to 25 Staff Members',
      'Everything in Basic',
      'Advanced Billing & Reports',
      'Internal Messaging',
      'Priority Support',
      'Custom Branding',
    ],
  },
  {
    name:     'Enterprise',
    value:    'enterprise',
    price:    '₹5,999',
    period:   'per month',
    desc:     'Built for large hospital chains and enterprise networks.',
    featured: false,
    features: [
      'Unlimited Staff Members',
      'Everything in Pro',
      'Dedicated Database',
      'API Access',
      'SLA Support',
      'Custom Integrations',
    ],
  },
];



export const features = [
  {
    icon: <PeopleIcon />, bg: '#E3F0FF', color: '#1565C0', delay: '0s',
    title: 'Patient Management',
    desc:  'Complete patient records, medical history, and profile management in one place.',
  },
  {
    icon: <CalendarIcon />, bg: '#E8F5E9', color: '#2E7D32', delay: '0.2s',
    title: 'Smart Scheduling',
    desc:  'Appointment booking, conflict detection, and calendar management for all staff.',
  },
  {
    icon: <ReceiptIcon />, bg: '#FFF3E0', color: '#E65100', delay: '0.4s',
    title: 'Billing & Invoicing',
    desc:  'Generate invoices, track payments, and manage billing history effortlessly.',
  },
  {
    icon: <SecurityIcon />, bg: '#FFEBEE', color: '#C62828', delay: '0.6s',
    title: 'Role-Based Access',
    desc:  'Granular permissions for Admin, Doctor, Nurse, Receptionist, and Pharmacist.',
  },
  {
    icon: <SpeedIcon />, bg: '#E3F0FF', color: '#1565C0', delay: '0.8s',
    title: 'Real-Time Notifications',
    desc:  'Instant alerts for appointments, payments, and system events.',
  },
  {
    icon: <CloudIcon />, bg: '#E8F5E9', color: '#2E7D32', delay: '1s',
    title: 'Multi-Tenant SaaS',
    desc:  'Each hospital gets isolated data, custom subdomain, and independent database.',
  },
];