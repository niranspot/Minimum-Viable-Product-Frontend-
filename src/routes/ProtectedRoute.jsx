import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';
import { getRoleHomePage, routePermissions } from '../utils/roleUtils';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, sessionChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  // Still restoring session → show spinner
  if (!sessionChecked) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if role allowed for current route
  const allowedRoles = routePermissions[location.pathname];
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Role not allowed → redirect to their home
    return <Navigate to={getRoleHomePage(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;