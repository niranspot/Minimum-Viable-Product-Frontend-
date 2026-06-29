import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, TextField, MenuItem, Alert,
  CircularProgress, Typography, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import styled            from 'styled-components';
import axiosClient       from '../../services/axiosClient';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1565C0 0%, #003C8F 60%, #1A1A2E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Inter', 'Roboto', sans-serif;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.3);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const PlanBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ plan }) =>
    plan === 'enterprise' ? '#1A1A2E' :
    plan === 'pro'        ? '#1565C0' : '#E3F0FF'};
  color: ${({ plan }) =>
    plan === 'enterprise' ? '#fff' :
    plan === 'pro'        ? '#fff' : '#1565C0'};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #1565C0;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  margin-top: 8px;
  &:hover:not(:disabled) { background: #003C8F; transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const SuccessBox = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const PLANS = ['basic', 'pro', 'enterprise'];

const TenantSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

const [form, setForm] = useState({
  company_name: '',
  subdomain:    '',
  email:        '',
  password:     '',
  plan:         location.state?.plan || 'basic',
});

const handleCompanyChange = (e) => {
  const name      = e.target.value;
  const subdomain = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')  // only letters and numbers
    .slice(0, 20);               // max 20 chars
  setForm({ ...form, company_name: name, subdomain });
  setError(null);
};

  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(null); // subdomain

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_name || !form.email || !form.password || !form.plan) return;

    setLoading(true);
    try {
      const res = await axiosClient.post('/tenant/signup', form);
      setSuccess(res.data.data.subdomain);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────
  if (success) {
    return (
      <Page>
        <Card>
          <SuccessBox>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#2E7D32', mb: 2 }} />
            <Typography variant="h3" fontWeight={700} color="#1A1A2E" mb={1}>
              You're all set! 🎉
            </Typography>
            <Typography variant="body2" color="#718096" mb={3}>
              Your hospital system is ready. Your subdomain is:
            </Typography>
            <Box sx={{
              background: '#E3F0FF',
              border: '2px solid #1565C0',
              borderRadius: 2,
              p: 2, mb: 3,
            }}>
              <Typography fontWeight={700} color="#1565C0" fontSize={18}>
                {success}.lvh.me:3000/
              </Typography>
            </Box>
            <Typography variant="body2" color="#718096" mb={3}>
              Check your email for login credentials and setup instructions.
            </Typography>
            <SubmitBtn onClick={() => navigate('/login')}>
              Go to Login
            </SubmitBtn>
          </SuccessBox>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        <Logo>
          <LocalHospitalIcon sx={{ fontSize: 32, color: '#1565C0' }} />
          <Typography variant="h3" fontWeight={800} color="#1565C0">
            MediCloud HMS
          </Typography>
        </Logo>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PlanBadge plan={form.plan}>
            {form.plan} Plan
          </PlanBadge>
          <Typography variant="body2" color="#718096">
            Create your hospital account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Hospital / Company Name"
            fullWidth required
            value={form.company_name}
            onChange={handleCompanyChange}   
            sx={{ mb: 2 }}
            disabled={loading}
            placeholder="e.g. Acme Hospital"
          />
          <TextField
            label="Subdomain"
            fullWidth required
            value={form.subdomain}
            onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                setForm({ ...form, subdomain: val });
            }}
            sx={{ mb: 2 }}
            disabled={loading}
            placeholder="e.g. acmehospital"
            helperText={
                form.subdomain
                ? `Your URL: ${form.subdomain}.yourhospital.com`
                : 'Auto-filled from company name, you can edit'
            }
            slotProps={{
                input: {
                endAdornment: form.subdomain && (
                    <InputAdornment position="end">
                    <Typography variant="caption" color="primary" fontWeight={600}>
                        .yourhospital.com
                    </Typography>
                    </InputAdornment>
                ),
                },
            }}
         />

          <TextField
            label="Admin Email"
            type="email"
            fullWidth required
            value={form.email}
            onChange={handleChange('email')}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            label="Password"
            type={showPass ? 'text' : 'password'}
            fullWidth required
            value={form.password}
            onChange={handleChange('password')}
            sx={{ mb: 2 }}
            disabled={loading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Plan"
            fullWidth required
            value={form.plan}
            onChange={handleChange('plan')}
            sx={{ mb: 3 }}
            disabled={loading}
          >
            {PLANS.map((p) => (
              <MenuItem key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <SubmitBtn type="submit" disabled={loading || !form.company_name || !form.subdomain || !form.email || !form.password}>
            {loading
              ? <><CircularProgress size={18} color="inherit" /> Creating your account...</>
              : 'Create Hospital Account →'
            }
          </SubmitBtn>

          <Typography
            variant="body2"
            color="#718096"
            textAlign="center"
            mt={2}
            sx={{ cursor: 'pointer', '&:hover': { color: '#1565C0' } }}
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign in
          </Typography>
        </Box>
      </Card>
    </Page>
  );
};

export default TenantSignupPage;