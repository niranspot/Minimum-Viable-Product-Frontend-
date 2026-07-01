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
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import { tokens } from '../../themes/theme';
import useTenant from '../../modules/tenant/hooks/useTenant';
import styled, { keyframes } from 'styled-components';
import { useTheme } from "@mui/material/styles";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const HOSPITAL_IMAGE = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80';

// ── Screen Wrapper: strictly locked to 100vh and prevents screen scrolling ──
export const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  background: ${props => props.theme.bg};
  transition: background 0.3s ease;

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    overflow: auto;
  }
`;

// ── Left Side Image Section ──
export const ImageSide = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(21, 101, 192, 0.85) 0%,
      rgba(0, 60, 143, 0.75) 50%,
      rgba(26, 26, 46, 0.9) 100%
    );
  }

  @media (max-width: 900px) {
    height: 250px;
    flex: none;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;

  @media (max-width: 900px) {
    padding: 24px;
    justify-content: flex-end;
  }
`;

export const ImageTitle = styled.h1`
  font-size: clamp(24px, 2.5vw, 38px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin: 0 0 12px;
  
  span { color: #60A5FA; }
`;

export const ImageSub = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0 0 24px;
  max-width: 420px;
`;

// ── Right Side Form Side: Handles inner scroll safely if viewport gets tiny ──
export const FormSide = styled.div`
  width: 480px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  align-items: center;
  padding: 30px 40px; 
  background: ${props => props.theme.surface};
  border-left: 1px solid ${props => props.theme.divider};
  overflow-y: auto; 
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    padding: 32px 24px;
    border-left: none;
  }
`;

export const FormInner = styled.div`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap:5px
  height: 100%;
  justify-content: space-between; // Pushes verification block neatly to bottom
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;

const ROLES = [
  { value: 'patient',      label: '🙎🏼 Patient',      desc: 'Make appointments' },
  { value: 'doctor',       label: '🩺 Doctor',       desc: 'Patient & appointments' },
  { value: 'nurse',        label: '💉 Nurse',        desc: 'Patient care' },
  { value: 'receptionist', label: '📋 Receptionist', desc: 'Front desk operations' },
  { value: 'pharmacist',   label: '💊 Pharmacist',   desc: 'Billing & prescriptions' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { company_name } = useTenant();
  const theme = useTheme();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
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
      {/* ── Left — Image Segment ── */}
      <ImageSide>
        <img src={HOSPITAL_IMAGE} alt="Medical Team" />
        <ImageOverlay>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocalHospital sx={{ color: '#60A5FA', fontSize: 28 }} />
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
              {company_name || 'MediCloud HMS'}
            </Typography>
          </Box>

          <ImageTitle>
            Join Your <span>Hospital</span><br />Team Today
          </ImageTitle>

          <ImageSub>
            Create your account to access patient records, appointments, and tools.
          </ImageSub>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5, }}>
            {[
              { icon: '🙎🏼', role: 'Patient', desc: 'Make appointments'},
              { icon: '🩺', role: 'Doctors',       desc: 'Manage patients & appointments' },
              { icon: '💉', role: 'Nurses',        desc: 'Patient care & records' },
              { icon: '📋', role: 'Receptionists',   desc: 'Scheduling & front desk' },
            ].map((r) => ( 
              <Box
                key={r.role}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2, px: 2, py: 0.75,
                }}
              >
                <Typography sx={{fontSize:20}}>{r.icon}</Typography>
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{r.role}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 10.5 }}>{r.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['HIPAA Compliant', 'Secure Access'].map((b) => (
              <Chip
                key={b}
                icon={<VerifiedUser sx={{ fontSize: '12px !important', color: '#60A5FA !important' }} />}
                label={b}
                size="small"
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: 10,
                }}
              />
            ))}
          </Box>
        </ImageOverlay>
      </ImageSide>

      {/* ── Right — Dynamic Content Form Block ── */}
      <FormSide>
        <FormInner>
          {/* Form Content Top Group */}
          <Box>
            <LogoBox>
              <LocalHospital sx={{ fontSize: 30, color: tokens.primary }} />
              <Typography variant="h3" color="primary" fontWeight={800} sx={{ fontSize: '1.6rem' }}>
                {company_name || 'MediCloud HMS'}
              </Typography>
            </LogoBox>

            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.30, fontSize: '1.35rem' }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3, fontSize: '0.825rem' }}>
              Register to become a member
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 1.5, py: 0 }} onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 1.5, py: 0 }}>Account created! Redirecting...</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
              <TextField
                label="Full Name"
                type="text"
                fullWidth required size="small"
                value={form.name}
                onChange={handleChange('name')}
                disabled={loading}
                placeholder="Dr. John Smith"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Email Address"
                type="email"
                fullWidth required size="small"
                value={form.email}
                onChange={handleChange('email')}
                disabled={loading}
                placeholder="John@gmail.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth required size="small"
                value={form.password}
                onChange={handleChange('password')}
                disabled={loading}
                placeholder="Password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Select Role"
                select
                fullWidth required size="small"
                value={form.role}
                onChange={handleChange('role')}
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlined sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value} sx={{ py: 0.5 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>{r.label}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>{r.desc}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit" variant="contained"
                fullWidth size="medium"
                disabled={loading || Object.values(form).some((v) => !v)}
                sx={{ py: 1, fontSize: 14, fontWeight: 700, borderRadius: 2, mt: 0.5 }}
              >
                {loading ? 'Creating account...' : 'Create Account →'}
              </Button>

              <Button
                fullWidth variant="text" size="small"
                startIcon={<ArrowBack sx={{ fontSize: '16px !important' }} />}
                onClick={() => navigate('/login')}
                sx={{ color: 'text.secondary', py: 0.25, fontSize: 13 }}
                disabled={loading}
              >
                Back to Login
              </Button>
            </Box>
          </Box>

          {/* Locked Footer Content Area */}
        <Box sx={{
          mt: 2, 
          pt: 1.5,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex', 
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start', // Anchors everything neatly to the left edge
          gap: 1,
        }}>
          <VerifiedUser sx={{ml:5, fontSize: 14, color: 'success.main' }} />
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              lineHeight: 1 
            }}
          >
            Your account will be verified by your hospital admin.
          </Typography>
        </Box>
        </FormInner>
      </FormSide>
    </PageWrapper>
  );
};

export default RegisterPage;