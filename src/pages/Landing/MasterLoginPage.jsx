import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, InputAdornment,
  IconButton, Alert, CircularProgress, Dialog,
  DialogContent, Chip, Divider, Tooltip, Button
} from '@mui/material';
import {
  AlternateEmail, LockOutlined, Visibility,
  VisibilityOff, LocalHospital, Launch,
  CheckCircle, Business, Language,
  StarBorder, ArrowForward
} from '@mui/icons-material';
import axiosClient from '../../services/axiosClient';

const PLAN_COLORS = {
  basic:       { color: '#0369a1', bg: '#e0f2fe' },
  pro:         { color: '#fff',    bg: '#2563eb' },
  enterprise: { color: '#fff',    bg: '#0f172a' },
};

const TenantPortalModal = ({ open, tenant, onClose }) => {
  const plan = PLAN_COLORS[tenant.plan] || PLAN_COLORS.basic;
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleLaunch = () => {
    window.open(`http://${tenant.subdomain}.lvh.me:3000/login`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth  
      slotProps={{ 
        paper: {   
          sx: {   
            borderRadius: 5, 
            overflow: 'hidden',  
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)', 
          }  
        } 
      }}
    >
      <DialogContent sx={{ p: 0, bgcolor: '#fff' }}>
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #4f6aa8 0%, #1e3a8a 60%, #1d4ed8 100%)',
          p: 4, 
          pb: 6, 
          position: 'relative', 
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <Box sx={{
            position: 'absolute', top: -40, right: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 72, 114, 0.15) 0%, rgba(96,165,250,0) 70%)',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -30, left: -30,
            width: 140, height: 140, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)',
          }} />

          {/* Logo Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 4, position: 'relative' }}>
            <LocalHospital sx={{ color: '#60a5fa', fontSize: 30 }} />
            <Typography sx={{fontWeight:900, color:"#f8fafc" ,fontSize:25 ,letterSpacing:0.5}}>
              MediCloud HMS
            </Typography>
          </Box>

          {/* Welcome Text */}
          <Box sx={{ position: 'relative' }}>
            <Typography sx={{color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:600, mb:0.5, letterSpacing:1.5,  textTransform: 'uppercase' }}>
              Welcome back
            </Typography>
            <Typography sx={{color:"#fff" ,fontWeight:800 ,fontSize:26 ,letterSpacing: '-0.5px', mb: 1.5, lineHeight: 1.2 }}>
              {tenant.company_name}
            </Typography>
            <Chip
              label={tenant.plan.toUpperCase()}
              sx={{
                size:"small",
                bgcolor: plan?.bg || 'rgba(255,255,255,0.15)',
                color: plan?.color || '#fff',
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: 1.5,
                height: 22,
                borderRadius: 1,
                px: 0.5,
              }}
            />
          </Box>
        </Box>

        {/* Details Card — overlaps header */}
        <Box sx={{ px: 3.5, mt: -3, position: 'relative', zIndex: 1 }}>
          <Box sx={{
            bgcolor: '#fff',
            borderRadius: 3.5,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            {[
              { icon: <Business sx={{ fontSize: 18 }} />, label: 'Organization', value: tenant.company_name },
              { icon: <AlternateEmail sx={{ fontSize: 18 }} />, label: 'Owner Email', value: tenant.email },
              { icon: <Language sx={{ fontSize: 18 }} />, label: 'Portal URL', value: `${tenant.subdomain}.lvh.me` },
            ].map((row, i, arr) => (
              <Box key={row.label} sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                px: 3, py: 2,
                borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#94a3b8' }}>
                  {row.icon}
                  <Typography fontSize={13.5} color="#475569" fontWeight={500}>{row.label}</Typography>
                </Box>
                <Typography fontSize={13.5} fontWeight={600} color="#0f172a">{row.value}</Typography>
              </Box>
            ))}
            
            {/* Status Section */}
            <Box sx={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              px: 3, py: 2,
              bgcolor: '#f8fafc',
              borderTop: '1px solid #f1f5f9'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle sx={{ fontSize: 18, color: '#94a3b8' }} />
                <Typography fontSize={13.5} color="#475569" fontWeight={500}>Status</Typography>
              </Box>
              <Chip
                label={tenant.status}
                size="small"
                sx={{
                  bgcolor: '#dcfce7', 
                  color: '#16a34a',
                  fontWeight: 700, 
                  fontSize: 11, 
                  height: 22,
                  borderRadius: 1,
                  textTransform: 'capitalize',
                  px: 0.5
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Actions Context */}
        <Box sx={{ px: 3.5, pt: 3, pb: 4.5 }}>
          {/* Main Action Button */}
          <Button 
            onClick={handleLaunch} 
            component="button"
            sx={{ 
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              textTransform: 'none',
              borderRadius: '10px',
              fontSize: '14.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(37,99,235,0.2)',
              marginBottom: '14px',
              '&:hover': { background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' },
              '&:disabled': { opacity: 0.6, cursor: 'not-allowed' }
            }}
          >
            <Launch sx={{ fontSize: 18 }} />
            Launch {tenant.company_name} Portal
            <ArrowForward sx={{ fontSize: 18 }} />
          </Button>

          {/* Conditional Upgrade Panel */}
          {!showUpgrade ? (
            <Box
              onClick={() => setShowUpgrade(true)}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 1, py: 1.8, borderRadius: 2.5,
                border: '1.5px dashed #cbd5e1',
                cursor: 'pointer', color: '#64748b',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: '#f0f9ff' },
              }}
            >
              <StarBorder sx={{ fontSize: 18 }} />
              <Typography fontSize={13.5} fontWeight={600}>Upgrade Plan</Typography>
            </Box>
          ) : (
            <Box sx={{
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0', 
              textAlign: 'center',
            }}>
              <StarBorder sx={{ color: '#d97706', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={700} color="#0f172a" fontSize={15} mb={0.5}>
                Ready to upgrade?
              </Typography>
              <Typography fontSize={13} color="#64748b" mb={2.5} lineHeight={1.6}>
                Contact our team and we'll upgrade your plan within 24 hours.
              </Typography>
              <Chip
                label="support@medicloud.com"
                variant="outlined"
                sx={{
                  fontWeight: 600, 
                  cursor: 'pointer',
                  borderColor: '#2563eb', 
                  color: '#2563eb',
                  px: 1,
                  py: 1.8,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#eff6ff', borderColor: '#1d4ed8', color: '#1d4ed8' }
                }}
                onClick={() => window.open('mailto:support@medicloud.com')}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
      {icon}
      <Typography fontSize={13} color="#64748b">{label}</Typography>
    </Box>
    {typeof value === 'string'
      ? <Typography fontSize={13} fontWeight={600} color="#0f172a">{value}</Typography>
      : value
    }
  </Box>
);

const MasterLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [tenant, setTenant]     = useState(null);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    setLoading(true);
    try {
      const res = await axiosClient.post('/master/login', form);
      setTenant(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        fontFamily: "'Inter', 'Roboto', sans-serif", 
        background: '#F8FAFC' 
      }}
    >
      {/* Left */}
      <Box 
        sx={{
            
          flex: 1.2,
          background: 'radial-gradient(circle at 80% 20%, #1e40af 0%, #1e3a8a 40%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: '-100px', right: '-100px',
            width: '500px', height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
          },
          '@media (max-width: 900px)': { display: 'none' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <LocalHospital sx={{ color: '#60A5FA', fontSize: 30 }} />
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>
            MediCloud <span style={{ fontWeight: 400, color: '#93C5FD' }}>HMS</span>
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            bgcolor: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
            borderRadius: 10, px: 2, py: 0.8, mb: 3,
          }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#60A5FA' }} />
            <Typography sx={{ color: '#93C5FD', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
              TENANT MANAGEMENT PORTAL
            </Typography>
          </Box>

          <Typography sx={{
            color: '#fff', fontSize: 'clamp(28px,3vw,42px)',
            fontWeight: 800, lineHeight: 1.15, mb: 2, letterSpacing: '-1px'
          }}>
            Your hospital,<br />
            <span style={{ color: '#60A5FA' }}>your portal.</span>
          </Typography>

          <Typography sx={{
            color: 'rgba(241,245,249,0.65)', fontSize: 15,
            lineHeight: 1.7, maxWidth: 380,
          }}>
            Sign in to view your organization details, manage your subscription, and launch your dedicated clinical portal.
          </Typography>
        </Box>

        {/* Feature list */}
        {[
          { emoji: '🏥', title: 'Dedicated Instance', desc: 'Isolated database per organization' },
          { emoji: '🔐', title: 'Secure Access', desc: 'Role-based permissions & JWT auth' },
          { emoji: '🚀', title: 'Instant Launch', desc: 'One click to your live portal' },
          { emoji: '📊', title: 'Real-Time Analytics', desc: 'Live patient & billing dashboards' },
        ].map((f) => (
          <Box key={f.title} sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            mb: 1, p: 1.5, borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18, flexShrink: 0,
            }}>
              {f.emoji}
            </Box>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 13.5 }}>{f.title}</Typography>
              <Typography sx={{ color: 'rgba(203,213,225,0.6)', fontSize: 12 }}>{f.desc}</Typography>
            </Box>
          </Box>
        ))}

        {/* Stats row */}
        <Box sx={{
          display: 'flex', gap: 3, mt: 4, pt: 3,
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          {[
            { value: '500+', label: 'Hospitals' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((s) => (
            <Box key={s.label}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{s.value}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 0.5 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right */}
      <Box 
        sx={{
          width: '520px',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px',
          animation: '0.4s ease',
          '@media (max-width: 900px)': {
            width: '100%',
            padding: '32px 24px',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <LocalHospital sx={{ color: '#2563eb', fontSize: 30 }} />
          <Typography sx={{fontWeight:800 ,color:"#0f172a" ,fontSize:20}}>HMS</Typography>
        </Box>

        <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{fontWeight:800, color:"#0f172a", letterSpacing: '-0.5px', mb: 0.5 }}>
          Tenant Portal Login
        </Typography>
        <Typography variant="body2" sx={{color:"#64748b" ,mb:3}}>
          Sign in with your organization owner credentials.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#475569', mb: 0.5, letterSpacing: 0.3 }}>
            OWNER EMAIL
          </Typography>
          <TextField
            type="email" fullWidth required size="small"
            value={form.email}
            onChange={handleChange('email')}
            sx={{ mb: 2 }}
            disabled={loading}
            placeholder="owner@hospital.com"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#475569', mb: 0.5, letterSpacing: 0.3 }}>
            PASSWORD
          </Typography>
          <TextField
            type={showPass ? 'text' : 'password'}
            fullWidth required size="small"
            value={form.password}
            onChange={handleChange('password')}
            sx={{ mb: 3 }}
            disabled={loading}
            placeholder="••••••••"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                      {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button 
            type="submit" 
            disabled={loading || !form.email || !form.password}
            sx={{
              width: '100%',
              padding: '13px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              textTransform: 'none',
              borderRadius: '10px',
              fontSize: '14.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(37,99,235,0.2)',
              '&:hover:not(:disabled)': { background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' },
              '&:disabled': { opacity: 0.6, cursor: 'not-allowed' }
            }}
          >
            {loading
              ? <CircularProgress size={16} color="inherit" />
              : <>Access Portal <ArrowForward fontSize="small" /></>
            }
          </Button>
        </Box>

        <Typography
          variant="body2" color="#64748b"
          textAlign="center" mt={3}
          sx={{ cursor: 'pointer', '&:hover': { color: '#2563eb' } ,variant:"body2", color:"#64748b",
          textAlign:"center" ,mt:3}}
          onClick={() => navigate('/signup')}
        >
          No workspace yet?{' '}
          <span style={{ color: '#2563eb', fontWeight: 600 }}>Create one →</span>
        </Typography>
      </Box>

      {/* Tenant Details Modal */}
      {tenant && (
        <TenantPortalModal 
          open={Boolean(tenant)} 
          tenant={tenant} 
          onClose={() => setTenant(null)} 
        />
      )}
    </Box>
  );
};

export default MasterLoginPage;