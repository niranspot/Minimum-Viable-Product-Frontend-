import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, IconButton, InputAdornment,
  FormControlLabel, Checkbox, Alert, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
import { tokens } from '../../themes/theme';
import useAuth from '../../modules/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, StyledCard, LogoBox } from '../../styles/auth.styles';

const LoginPage = () => {
  const { login, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem('remember_email');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  // Clear error on input change
  useEffect(() => {
    if (error) clearAuthError();
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (rememberMe) {
      localStorage.setItem('remember_email', email);
    } else {
      localStorage.removeItem('remember_email');
    }

    login(email, password);
  };

  return (
    <PageWrapper>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <LogoBox>
            <LocalHospital sx={{ fontSize: 36, color: tokens.primary }} />
            <Typography variant="h2" color="primary">
              HMS
            </Typography>
          </LogoBox>

          <Typography variant="body2" align="center" sx={{ mb: 3, color: tokens.grey }}>
            Hospital Management System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearAuthError}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              autoComplete="email"
              disabled={loading}
            />

           <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
              disabled={loading}
              // Change InputProps to slotProps.input
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{display: "flex", justifyContent:"space-between", alignItems:"center", mb:2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate('/change-password')}
              >
                Change Password?
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !email || !password}
              sx={{ py: 1.4 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1.5, color: tokens.grey }}
              onClick={() => navigate('/register')}
              disabled={loading}
            >
              Register new account
            </Button>
          </Box>
        </CardContent>
      </StyledCard>
    </PageWrapper>
  );
};

export default LoginPage;