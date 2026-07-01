import React from 'react';
import {
  AppBar, Toolbar, Typography, Box,
  IconButton, Tooltip, Chip
} from '@mui/material';
import LogoutIcon        from '@mui/icons-material/Logout';
import DarkModeIcon     from '@mui/icons-material/DarkMode';
import LightModeIcon    from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon          from '@mui/icons-material/Menu';
import { useSelector }  from 'react-redux';
import useAuth          from '../../modules/auth/hooks/useAuth';
import { useThemeMode } from '../../context/ThemeContext';
import { useLocation }  from 'react-router-dom';
import { menuItems }    from './menuConfig';
import useTenant from '../../modules/tenant/hooks/useTenant';

const OPEN   = 240;
const CLOSED = 64;

const roleColors = {
  admin:        '#3B82F6',
  doctor:       '#2E7D32',
  nurse:        '#7C3AED',
  receptionist: '#E65100',
  pharmacist:   '#C62828',
};

const Topbar = ({ sidebarOpen, isMobile, onMobileToggle }) => {
  const { company_name } = useTenant();
  const { user }              = useSelector((state) => state.auth);
  const { logout }            = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const location              = useLocation();
  const role                  = user?.role || '';

  // Get current page label
  const currentPage = menuItems.find((i) => i.path === location.pathname)?.label || 'Dashboard';

  // Calculate dynamic width and margins based on device type
  const appBarWidth = isMobile ? '100%' : `calc(100% - ${sidebarOpen ? OPEN : CLOSED}px)`;
  const appBarMarginLeft = isMobile ? 0 : `${sidebarOpen ? OPEN : CLOSED}px`;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: appBarWidth,
        ml: appBarMarginLeft,
        transition: 'width 0.25s ease, margin-left 0.25s ease',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Hamburger menu visible ONLY on mobile */}
          {isMobile && (
            <IconButton onClick={onMobileToggle} sx={{ color: 'text.primary', p: 0.5 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box>
            {/* Tweaked down to h6 for correct AppBar visual balance */}
            <Typography variant="h6" fontWeight={700} sx={{lineHeight:1.2}}>
              {currentPage}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Today: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {role && (
            <Chip
              label={role.charAt(0).toUpperCase() + role.slice(1)}
              size="small"
              sx={{
                bgcolor: `${roleColors[role] || '#3B82F6'}22`, // Safeguarded fallback
                color: roleColors[role] || '#3B82F6',
                fontWeight: 600,
                fontSize: 11,
                height: 24,
              }}
            />
          )}



          <Tooltip title="Logout">
            <IconButton size="small" onClick={logout} sx={{ color: '#C62828' }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;