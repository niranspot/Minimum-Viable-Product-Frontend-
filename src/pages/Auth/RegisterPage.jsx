import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, IconButton, InputAdornment,
  Alert, CircularProgress, MenuItem
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
  max-width: 440px;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
`;

const ROLES = [
  { value: 'admin',        label: 'Admin' },
  { value: 'doctor',       label: 'Doctor' },
  { value: 'nurse',        label: 'Nurse' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'pharmacist',   label: 'Pharmacist' },
];

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tenant_id: '',
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { tenant_id, name, email, password, role } = form;
    if (!tenant_id || !name || !email || !password || !role) return;

    setLoading(true);
    try {
      await axiosClient.post('/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{display:"flex", alignItems:"center", gap:1, mb:3}}>
            <LocalHospital sx={{ fontSize: 28, color: tokens.primary }} />
            <Typography variant="h3" color="primary">Register Account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Registered! Redirecting to login...</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Tenant ID"
              type="number"
              fullWidth
              required
              value={form.tenant_id}
              onChange={handleChange('tenant_id')}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <TextField
              label="Full Name"
              fullWidth
              required
              value={form.name}
              onChange={handleChange('name')}
              sx={{ mb: 2 }}
              disabled={loading}
            />

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
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={form.password}
              onChange={handleChange('password')}
              sx={{ mb: 2 }}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Role"
              select
              fullWidth
              required
              value={form.role}
              onChange={handleChange('role')}
              sx={{ mb: 3 }}
              disabled={loading}
            >
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || Object.values(form).some((v) => !v)}
              sx={{ py: 1.4, mb: 1.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Register'}
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

export default RegisterPage;