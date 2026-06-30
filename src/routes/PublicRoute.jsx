import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, sessionChecked } = useSelector(state => state.auth);

  if (!sessionChecked) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

export default PublicRoute;