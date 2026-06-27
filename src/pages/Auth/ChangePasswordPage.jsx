import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, IconButton, InputAdornment,
  Alert, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital, ArrowBack } from '@mui/icons-material';
import styled from 'styled-components';
import { tokens } from '../../themes/theme';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${tokens.primary} 0%, ${tokens.primaryDark} 60%, ${tokens.dark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
`;

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', old_password: '', new_password: '' });
  const [show, setShow] = useState({ old: false, new: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.old_password || !form.new_password) return;

    setLoading(true);
    try {
      await axiosClient.post('/change-password', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <LocalHospital sx={{ fontSize: 28, color: tokens.primary }} />
            <Typography variant="h3" color="primary">Change Password</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Password changed! Redirecting...</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={handleChange('email')}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <TextField
              label="Old Password"
              type={show.old ? 'text' : 'password'}
              fullWidth
              required
              value={form.old_password}
              onChange={handleChange('old_password')}
              sx={{ mb: 2 }}
              disabled={loading}
              // ✅ Fixed: Changed InputProps to slotProps.input
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShow({ ...show, old: !show.old })} edge="end">
                        {show.old ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="New Password"
              type={show.new ? 'text' : 'password'}
              fullWidth
              required
              value={form.new_password}
              onChange={handleChange('new_password')}
              sx={{ mb: 3 }}
              disabled={loading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShow({ ...show, new: !show.new })} edge="end">
                        {show.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !form.email || !form.old_password || !form.new_password}
              sx={{ py: 1.4, mb: 1.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Change Password'}
            </Button>

            <Button
              fullWidth
              variant="text"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/login')}
              sx={{ color: tokens.grey }}
            >
              Back to Login
            </Button>
          </Box>
        </CardContent>
      </StyledCard>
    </PageWrapper>
  );
};

export default ChangePasswordPage;