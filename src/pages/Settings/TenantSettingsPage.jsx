import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Card, CardContent, Stack,
  Divider, Button, CircularProgress
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { updateThemeRequest } from '../../modules/tenant/tenantSlice';

const TenantSettingsPage = () => {
  const dispatch = useDispatch();
  const {
    company_name, subdomain, plan, status,
    theme_settings, loading
  } = useSelector(state => state.tenant);

  const handleThemeChange = (theme) => {
    if (theme === theme_settings) return;
    dispatch(updateThemeRequest({ theme_settings: theme }));
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{fontWeight:700, mb:3}}>
        Tenant Details
      </Typography>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{color:"text.secondary" ,mb:2}}>
            Organization Details
          </Typography>
            <Stack spacing={1.5}>
              <Row label="Company Name" value={company_name} />
              <Row label="Subdomain" value={`${subdomain}.lvh.me`} />
              <Row label="Plan" value={plan} highlight />
              <Row label="Status" value={status} color={status === 'active' ? 'success.main' : 'text.secondary'} />
            </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Appearance
          </Typography>
          <Stack direction="row" spacing={2}>
            <ThemeOption
              label="Dark"
              icon={<DarkModeIcon />}
              active={theme_settings === 'dark'}
              loading={loading}
              onClick={() => handleThemeChange('dark')}
            />
            <ThemeOption
              label="Warm"
              icon={<WbSunnyIcon />}
              active={theme_settings === 'warm'}
              loading={loading}
              onClick={() => handleThemeChange('warm')}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

const Row = ({ label, value, highlight, color }) => (
  <Stack sx={{direction:"row", justifyContent:"space-between" ,alignItems:"center"}}>
    <Typography variant="body2" sx={{color:"text.secondary", component:"span"}}>
      {label}
    </Typography>
    <Typography
      variant="body2"
      
      component="span"
      sx={{ color: color || 'text.primary', textTransform: highlight ? 'capitalize' : 'none',fontWeight:600 }}
    >
      {value}
    </Typography>
  </Stack>
);

const ThemeOption = ({ label, icon, active, loading, onClick }) => (
  <Button
    variant={active ? 'contained' : 'outlined'}
    onClick={onClick}
    disabled={loading}
    startIcon={loading && active ? <CircularProgress size={16} color="inherit" /> : icon}
    sx={{ flex: 1, py: 1.5, borderRadius: 2 }}
  >
    {label}
  </Button>
);

export default TenantSettingsPage;