import React, { useEffect, useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme, Drawer } from '@mui/material'; // Removed invalid ", state"
import { Outlet } from 'react-router-dom'; // Added for nested route compatibility
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import { fetchCsrf } from '../../hooks/useAppInit';

const OPEN   = 240;
const CLOSED = 64;

const DashboardLayout = ({ children }) => {
  const [open, setOpen]         = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme                   = useTheme();
  const isMobile                = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
      fetchCsrf();
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* Desktop sidebar */}
      {!isMobile && (
        <Sidebar open={open} onToggle={() => setOpen(!open)} />
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: OPEN, background: '#1A1A2E' } }}
        >
          <Sidebar open={true} onToggle={() => setMobileOpen(false)} />
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${open ? OPEN : CLOSED}px`,
          transition: 'margin-left 0.25s ease',
          width: isMobile ? '100%' : 'auto',
        }}
      >
        <Topbar
          sidebarOpen={open}
          isMobile={isMobile}
          onMobileToggle={() => setMobileOpen(true)}
        />
        <Toolbar sx={{ minHeight: '56px !important' }} />
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Fallback to legacy children prop if passed, otherwise load React Router's Outlet */}
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;