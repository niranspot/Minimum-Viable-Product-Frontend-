import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 2,
  }}>
    <Typography variant="h2" color="error">
      Something went wrong
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {error?.message || 'Unexpected error occurred'}
    </Typography>
    <Button variant="contained" onClick={resetErrorBoundary}>
      Try Again
    </Button>
  </Box>
);

const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.href = '/'}
  >
    {children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;