import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

const OPEN   = 240;
const CLOSED = 64;

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (

      <Box 
        sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={open} onToggle={() => setOpen(!open)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${open ? OPEN : CLOSED}px`,
          transition: 'margin-left 0.25s ease',
        }}
      >
        <Topbar sidebarOpen={open} />
        <Toolbar sx={{ minHeight: '56px !important' }} />
        <Box sx={{p:3}}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;