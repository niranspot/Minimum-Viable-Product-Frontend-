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

  return (
    <Box>
      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: s.bg,
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography variant="h2" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                  {s.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ opacity: 0.8, display: 'flex' }}>{s.icon}</Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                    {s.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Placeholder content */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" mb={2}>Recent Activity</Typography>
              <Typography variant="body2" color="text.secondary">
                Dev 2 & Dev 3 will fill this with real data.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" mb={2}>Upcoming</Typography>
              <Typography variant="body2" color="text.secondary">
                Dev 2 & Dev 3 will fill this.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;