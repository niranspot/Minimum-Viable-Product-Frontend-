import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography,
  IconButton, InputAdornment, FormControlLabel,
  Checkbox, Alert, CircularProgress, Chip, Card
} from '@mui/material';
import {
  Visibility, VisibilityOff, LocalHospital,
  LockOutlined, EmailOutlined, VerifiedUser, Person
} from '@mui/icons-material';
import { tokens } from '../../themes/theme';
import useAuth from '../../modules/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useTenant from '../../modules/tenant/hooks/useTenant';
import styled, { keyframes } from 'styled-components';
import { useTheme } from "@mui/material/styles";


const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Split screen wrapper ───────────────────────────────
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
    background: ${({ theme }) => theme.bg};
  transition: background .3s ease;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// ── Left side — hospital image ─────────────────────────
const ImageSide = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 300px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Dark overlay on image */
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

  @media (max-width: 768px) {
    min-height: 200px;
    flex: none;
  }
`;

// ── Text on top of image ───────────────────────────────
const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;

  @media (max-width: 768px) {
    padding: 24px;
    justify-content: flex-end;
  }
`;

const ImageTitle = styled.h1`
  font-size: clamp(28px, 3vw, 48px);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 16px;
  span { color: #60A5FA; }
`;

const ImageSub = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.75);
  line-height: 1.6;
  margin: 0 0 32px;
  max-width: 400px;
`;

const ImageStats = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

const ImageStat = styled.div`
  .value {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    display: block;
  }
  .label {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

// ── Right side — form ──────────────────────────────────
const FormSide = styled.div`
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: ${({ theme }) => theme.surface};
color: ${({ theme }) => theme.text};
transition: background .3s ease;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    width: 100%;
    padding: 32px 24px;
  }
`;

 const FormInner = styled.div`
  width: 100%;
  max-width: 380px;
`;

// ── Logo box ───────────────────────────────────────────
 const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

// ── Keep StyledCard for Register/ChangePassword ────────
 const StyledCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  border-radius: 16px !important;
  background: ${({theme})=>theme.surface};
border:1px solid ${({theme})=>theme.divider};

box-shadow:${({theme}) =>
  theme.bg === '#0D1117'
    ? '0 20px 60px rgba(0,0,0,.5)'
    : '0 20px 60px rgba(0,0,0,.08)'};
`;

// ── Auth page wrapper for Register/ChangePassword ──────
const AuthPageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1565C0 0%, #003C8F 60%, #1A1A2E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// ── Divider with text ──────────────────────────────────
 const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 13px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.divider};
  }
`;

const HOSPITAL_IMAGE = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80';

const LoginPage = () => {
  const { login, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const { company_name } = useTenant();
  const navigate = useNavigate();
  const theme = useTheme();
  

 

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem('remember_email');
    if (remembered) { setEmail(remembered); setRememberMe(true); }
  }, []);


  useEffect(() => {
    if (error) clearAuthError();
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    rememberMe
      ? localStorage.setItem('remember_email', email)
      : localStorage.removeItem('remember_email');
    login(email, password);
  };

  return (
    <PageWrapper>

      {/* ── Left — Hospital Image ── */}
      <ImageSide>
        <img src={HOSPITAL_IMAGE} alt="Hospital" />
        <ImageOverlay>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <LocalHospital sx={{ color: '#60A5FA', fontSize: 32 }} />
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>
              {company_name || 'MediCloud HMS'}
            </Typography>
          </Box>

          <ImageTitle>
            Healthcare <span>Management</span><br />Made Simple
          </ImageTitle>

          <ImageSub>
            Manage patients, appointments, billing and staff
            all from one secure, cloud-based platform.
          </ImageSub>

          <ImageStats>
            {[
              { value: '500+', label: 'Hospitals' },
              { value: '1M+',  label: 'Patients' },
              { value: '99.9%',label: 'Uptime' },
            ].map((s) => (
              <ImageStat key={s.label}>
                <span className="value">{s.value}</span>
                <span className="label">{s.label}</span>
              </ImageStat>
            ))}
          </ImageStats>

          {/* Trust badges */}
          <Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap' }}>
            {['HIPAA Compliant', 'ISO 27001', '256-bit SSL'].map((b) => (
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

      {/* ── Right — Login Form ── */}
      <FormSide>
        <FormInner>
          <LogoBox>
            <LocalHospital sx={{ fontSize: 32, color: tokens.primary }} />
            <Typography variant="h2" color="primary" fontWeight={800}>
              HMS
            </Typography>
          </LogoBox>

          <Typography variant="h3" sx={{fontWeight:700 ,color: theme.palette.text.primary ,mb:0.5}}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{color: theme.palette.text.secondary ,mb:3}}>
            Sign in to {company_name || 'your hospital system'}
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
              fullWidth required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
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
              fullWidth required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary" size="small"
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Typography
                variant="body2" color="primary"
                sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate('/change-password')}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit" variant="contained"
              fullWidth size="large"
              disabled={loading || !email || !password}
              sx={{ py: 1.5, fontSize: 15, fontWeight: 700, borderRadius: 2, mb: 2 }}
            >
              {loading
                ? <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Signing in...</>
                : 'Sign In →'
              }
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Need an account?{' '}
                <Typography
                  component="span" variant="body2"
                  color="primary" fontWeight={600}
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/register')}
                >
                  Register here
                </Typography>
              </Typography>
            </Box>
          </Box>

          {/* Security note */}
          <Box sx={{
            mt: 4, pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex', alignItems: 'center',
            gap: 1,
          }}>
            <VerifiedUser sx={{ml:5, fontSize: 16, color: theme.palette.success.main}} />
            <Typography variant="caption" color="text.secondary">
              Secured with 256-bit SSL encryption. Your data is safe.
            </Typography>
          </Box>
        </FormInner>
      </FormSide>

    </PageWrapper>
  );
};

export default LoginPage;