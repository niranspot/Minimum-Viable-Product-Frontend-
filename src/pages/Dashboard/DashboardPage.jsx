import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import PeopleIcon     from '@mui/icons-material/People';
import EventIcon      from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon    from '@mui/icons-material/Warning';
import { useSelector } from 'react-redux';

const stats = [
  { label: 'Total Patients',       value: '—', icon: <PeopleIcon />,     bg: '#3B82F6' },
  { label: 'Total Visits',         value: '—', icon: <EventIcon />,      bg: '#1B8A5A' },
  { label: 'Follow-ups This Week', value: '—', icon: <AccessTimeIcon />, bg: '#F59E0B' },
  { label: 'Overdue Follow-ups',   value: '—', icon: <WarningIcon />,    bg: '#E53E3E' },
];

const DashboardPage = () => {

  // throw new Error('Test crash!');
  

  const { user } = useSelector((state) => state.auth);

  return (<></>
    
  );
};

export default DashboardPage;