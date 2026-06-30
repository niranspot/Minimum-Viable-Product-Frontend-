import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const ROLE_HOME = {
  patient: '/dashboard/appointments',
  admin: '/dashboard', doctor: '/dashboard', nurse: '/dashboard',
  pharmacist: '/dashboard', receptionist: '/dashboard',
};

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, sessionChecked, user } = useSelector(state => state.auth);
  const role = user?.role;

  if (!sessionChecked) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to={ROLE_HOME[role] || '/login'} replace />;

  return children;
};

export default RoleProtectedRoute;