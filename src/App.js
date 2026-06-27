import React                     from 'react';
import { StyleSheetManager }     from 'styled-components';
import { ThemeProvider }         from './context/ThemeContext';
import ErrorBoundary             from './components/common/ErrorBoundary';
import AppRouter                 from './routes/AppRouter';
import { CircularProgress, Box } from '@mui/material';
import useAppInit                from './hooks/useAppInit';

const AppContent = () => {
  const { restoring } = useAppInit();

  if (restoring) {
    return (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
};

const App = () => (
  <StyleSheetManager>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </StyleSheetManager>
);

export default App;