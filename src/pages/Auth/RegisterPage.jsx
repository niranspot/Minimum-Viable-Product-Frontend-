import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography,
  IconButton, InputAdornment, Alert,
  CircularProgress, MenuItem, Chip
} from '@mui/material';
import {
  Visibility, VisibilityOff, LocalHospital,
  ArrowBack, Person, EmailOutlined,
  LockOutlined, BadgeOutlined, VerifiedUser
} from '@mui/icons-material';
import { tokens } from '../../themes/theme';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import useTenant from '../../modules/tenant/hooks/useTenant';
import {
  PageWrapper, ImageSide, ImageOverlay,
  ImageTitle, ImageSub, FormSide, FormInner, LogoBox,
} from '../../styles/auth.styles';

const HOSPITAL_IMAGE = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80';

const ROLES = [
  { value: 'admin',        label: '👑 Admin',        desc: 'Full system access' },
  { value: 'patient',        label: '🙎🏼 Patient',        desc: 'Full system access' },
  { value: 'doctor',       label: '🩺 Doctor',       desc: 'Patient & appointments' },
  { value: 'nurse',        label: '💉 Nurse',         desc: 'Patient care' },
  { value: 'receptionist', label: '📋 Receptionist', desc: 'Front desk operations' },
  { value: 'pharmacist',   label: '💊 Pharmacist',   desc: 'Billing & prescriptions' },
];

const RegisterPage = () => {
  const navigate        = useNavigate();
  const { company_name } = useTenant();

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [success,      setSuccess]      = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = form;
    if (!name || !email || !password || !role) return;

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

      {/* ── Left — Hospital Image ── */}
      <ImageSide>
        <img src={HOSPITAL_IMAGE} alt="Medical Team" />
        <ImageOverlay>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <LocalHospital sx={{ color: '#60A5FA', fontSize: 32 }} />
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>
              {company_name || 'MediCloud HMS'}
            </Typography>
          </Box>

          <ImageTitle>
            Join Your <span>Hospital</span><br />Team Today
          </ImageTitle>

          <ImageSub>
            Create your account to access patient records,
            appointments, and hospital management tools.
          </ImageSub>

          {/* Role cards preview */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { icon: '🩺', role: 'Doctors',        desc: 'Manage patients & appointments' },
              { icon: '💉', role: 'Nurses',          desc: 'Patient care & records' },
              { icon: '📋', role: 'Receptionists',   desc: 'Scheduling & front desk' },
            ].map((r) => (
              <Box
                key={r.role}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 2, px: 2, py: 1,
                }}
              >
                <Typography fontSize={20}>{r.icon}</Typography>
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>
                    {r.role}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                    {r.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap' }}>
            {['HIPAA Compliant', 'Secure Access', '24/7 Support'].map((b) => (
              <Chip
                key={b}
                icon={<VerifiedUser sx={{ fontSize: '14px !important', color: '#60A5FA !important' }} />}
                label={b}
                size="small"
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: 11,
                }}
              />
            ))}
          </Box>
        </ImageOverlay>
      </ImageSide>

      {/* ── Right — Register Form ── */}
      <FormSide>
        <FormInner>
          <LogoBox>
            <LocalHospital sx={{ fontSize: 32, color: tokens.primary }} />
            <Typography variant="h2" color="primary" fontWeight={800}>
              HMS
            </Typography>
          </LogoBox>

          <Typography variant="h3" fontWeight={700} color={tokens.dark} mb={0.5}>
            Create Account
          </Typography>
          <Typography variant="body2" color={tokens.grey} mb={3}>
            Register to join {company_name || 'your hospital system'}
          </Typography>

          {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Account created! Redirecting to login...</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Full Name"
              fullWidth required
              value={form.name}
              onChange={handleChange('name')}
              sx={{ mb: 2 }}
              disabled={loading}
              placeholder="Dr. John Smith"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: tokens.grey, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Email Address"
              type="email"
              fullWidth required
              value={form.email}
              onChange={handleChange('email')}
              sx={{ mb: 2 }}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: tokens.grey, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth required
              value={form.password}
              onChange={handleChange('password')}
              sx={{ mb: 2 }}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: tokens.grey, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Select Role"
              select
              fullWidth required
              value={form.role}
              onChange={handleChange('role')}
              sx={{ mb: 3 }}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlined sx={{ color: tokens.grey, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            >
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{r.label}</Typography>
                    <Typography variant="caption" color={tokens.grey}>{r.desc}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth size="large"
              disabled={loading || Object.values(form).some((v) => !v)}
              sx={{ py: 1.5, fontSize: 15, fontWeight: 700, borderRadius: 2, mb: 2 }}
            >
              {loading
                ? <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Creating account...</>
                : 'Create Account →'
              }
            </Button>

            <Button
              fullWidth variant="text"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/login')}
              sx={{ color: tokens.grey }}
              disabled={loading}
            >
              Back to Login
            </Button>
          </Box>

          {/* Security note */}
          <Box sx={{
            mt: 3, pt: 3,
            borderTop: `1px solid ${tokens.border}`,
            display: 'flex', alignItems: 'center', gap: 1,
          }}>
            <VerifiedUser sx={{ fontSize: 16, color: tokens.green }} />
            <Typography variant="caption" color={tokens.grey}>
              Your account will be verified by your hospital admin.
            </Typography>
          </Box>
        </FormInner>
      </FormSide>

    </PageWrapper>
  );
};

export default RegisterPage;