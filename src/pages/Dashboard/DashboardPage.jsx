import React from 'react';
import {
  Box, Typography, Grid, CircularProgress, Alert, Divider, Chip,
} from '@mui/material';
import { Table, Tag } from 'antd';
import PeopleIcon       from '@mui/icons-material/People';
import EventIcon        from '@mui/icons-material/Event';
import MedicalIcon      from '@mui/icons-material/MedicalServices';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import HourglassIcon    from '@mui/icons-material/HourglassEmpty';
import CancelIcon       from '@mui/icons-material/Cancel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ShieldIcon       from '@mui/icons-material/Shield';
import styled           from 'styled-components';
import useDashboard     from '../../modules/dashboard/hooks/useDashboard';
import { useSelector }  from 'react-redux';
import { useEffect }    from 'react';

// ── Hero banner (Unsplash) ──────────────────────────────────────
const Hero = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 230px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  padding: 36px 40px;
  background-image:
    linear-gradient(120deg, rgba(123,31,162,0.92) 10%, rgba(123,31,162,0.55) 60%, rgba(123,31,162,0.15) 100%),
    url('https://source.unsplash.com/1600x500/?healthcare,dashboard,clinic');
  background-size: cover;
  background-position: center;
`;

const HeroShield = styled(ShieldIcon)`
  position: absolute !important;
  right: 36px;
  bottom: 28px;
  font-size: 64px !important;
  color: rgba(255,255,255,0.18);
`;

const HeroText = styled.div`
  color: #fff;
  max-width: 600px;
  position: relative;
  z-index: 1;
`;

const HeroBadges = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const HeroBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: #fff;
`;

// ── Styled ─────────────────────────────────────────────────────
const PageWrapper = styled.div`
  background: ${({ theme }) => theme.bg};
  min-height: 100%;
`;

const SummaryCard = styled.div`
  position: relative;
  background: ${({ bg }) => bg};
  border-radius: 16px;
  padding: 20px 22px 18px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
  }
`;

const IconBox = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DataCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 16px;
  padding: 22px;
  height: 100%;
`;

const SectionTitle = styled(Typography)`
  font-weight: 800 !important;
  margin-bottom: 16px !important;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

// ── Table columns for per-day appointments ────────────────────
const perDayColumns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  {
    title: 'Appointments',
    dataIndex: 'count',
    key: 'count',
    render: (v) => <Tag color="blue">{v}</Tag>,
  },
];

// ── Table columns for per-doctor ──────────────────────────────
const perDoctorColumns = [
  {
    title: 'Doctor',
    dataIndex: 'doctor_name',
    key: 'doctor_name',
    render: (v) => <Typography variant="body2" fontWeight={600}>{v}</Typography>,
  },
  { title: 'Total', dataIndex: 'total', key: 'total', render: (v) => <Tag color="blue">{v}</Tag> },
  { title: 'Completed', dataIndex: 'completed', key: 'completed', render: (v) => <Tag color="green">{v}</Tag> },
  { title: 'Cancelled', dataIndex: 'cancelled', key: 'cancelled', render: (v) => <Tag color="red">{v}</Tag> },
];

const perPrescriptionDoctorColumns = [
  {
    title: 'Doctor',
    dataIndex: 'doctor_name',
    key: 'doctor_name',
    render: (v) => <Typography variant="body2" fontWeight={600}>{v}</Typography>,
  },
  { title: 'Created',   dataIndex: 'created',   key: 'created',   render: (v) => <Tag color="blue">{v}</Tag> },
  { title: 'Verified',  dataIndex: 'verified',  key: 'verified',  render: (v) => <Tag color="orange">{v}</Tag> },
  { title: 'Dispensed', dataIndex: 'dispensed', key: 'dispensed', render: (v) => <Tag color="green">{v}</Tag> },
];

const buildPrescriptionRows = (byStatusAndDoctor = []) => {
  const byDoctor = {};
  byStatusAndDoctor.forEach((row) => {
    const key = row.doctor_id;
    if (!byDoctor[key]) {
      byDoctor[key] = {
        doctor_id: row.doctor_id,
        doctor_name: row.doctor_name,
        created: 0,
        verified: 0,
        dispensed: 0,
      };
    }
    if (byDoctor[key][row.status] !== undefined) byDoctor[key][row.status] = row.count;
  });
  return Object.values(byDoctor);
};

// ── Component ──────────────────────────────────────────────────
const DashboardPage = () => {
  const { summary, appointments, prescriptions, loading, error, fetchDashboard } = useDashboard();
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => { fetchDashboard(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !summary) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  const apptStats = summary?.appointment_stats || {};
  const rxSummary = summary?.prescription_summary || {};

  const statCards = [
    { label: 'Total Patients',           value: summary?.total_patients ?? '—', icon: <PeopleIcon />,      bg: '#1565C0' },
    { label: 'Total Appointments',       value: apptStats.total ?? '—',         icon: <EventIcon />,       bg: '#1B8A5A' },
    { label: 'Total Prescriptions',      value: rxSummary.total ?? '—',         icon: <MedicalIcon />,     bg: '#7B1FA2' },
    { label: 'Completed Appointments',   value: apptStats.completed ?? '—',     icon: <CheckCircleIcon />, bg: '#2E7D32' },
  ];

  const perDay = appointments?.per_day || [];
  const perDoctor = appointments?.per_doctor || [];
  const perPrescriptionDoctor = buildPrescriptionRows(prescriptions?.by_status_and_doctor);

  return (
    <PageWrapper>
      <Hero>
        <HeroShield />
        <HeroText>
          <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 1 }}>
            {isAdmin ? 'Admin Dashboard' : 'Provider Dashboard'}
          </Typography>
          <Typography sx={{ fontSize: 14.5, opacity: 0.92, lineHeight: 1.5 }}>
            A real-time snapshot of patients, appointments, and prescriptions across your tenant.
          </Typography>
          <HeroBadges>
            <HeroBadge><VerifiedUserIcon style={{ fontSize: 16 }} /> Live Data</HeroBadge>
            <HeroBadge><TravelExploreIcon style={{ fontSize: 16 }} /> Tenant-wide</HeroBadge>
            <HeroBadge><CheckCircleIcon style={{ fontSize: 16 }} /> At-a-glance Stats</HeroBadge>
          </HeroBadges>
        </HeroText>
      </Hero>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* ── Top Summary Cards ──────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCard bg={s.bg}>
              <IconBox>{s.icon}</IconBox>
              <Box>
                <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>{s.label}</Typography>
              </Box>
            </SummaryCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Appointment Status Breakdown + Per Day ─────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DataCard>
            <SectionTitle variant="h6">Appointment Status</SectionTitle>

            <StatusRow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HourglassIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                <Typography variant="body2">Pending</Typography>
              </Box>
              <Chip label={apptStats.pending ?? 0} size="small" sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700 }} />
            </StatusRow>
            <Divider />

            <StatusRow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon sx={{ color: '#1565C0', fontSize: 18 }} />
                <Typography variant="body2">Confirmed</Typography>
              </Box>
              <Chip label={apptStats.confirmed ?? 0} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 700 }} />
            </StatusRow>
            <Divider />

            <StatusRow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
                <Typography variant="body2">Completed</Typography>
              </Box>
              <Chip label={apptStats.completed ?? 0} size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700 }} />
            </StatusRow>
            <Divider />

            <StatusRow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CancelIcon sx={{ color: '#C62828', fontSize: 18 }} />
                <Typography variant="body2">Cancelled</Typography>
              </Box>
              <Chip label={apptStats.cancelled ?? 0} size="small" sx={{ bgcolor: '#FFEBEE', color: '#C62828', fontWeight: 700 }} />
            </StatusRow>
          </DataCard>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <DataCard>
            <SectionTitle variant="h6">Appointments Per Day</SectionTitle>
            <Table
              dataSource={perDay}
              columns={perDayColumns}
              rowKey="date"
              pagination={false}
              size="small"
              loading={loading}
              locale={{ emptyText: 'No appointment data yet' }}
            />
          </DataCard>
        </Grid>
      </Grid>

      {/* ── Per Doctor (appointments + prescriptions) ─────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataCard>
            <SectionTitle variant="h6">Appointments by Doctor</SectionTitle>
            <Table
              dataSource={perDoctor}
              columns={perDoctorColumns}
              rowKey="doctor_id"
              pagination={false}
              size="small"
              loading={loading}
              locale={{ emptyText: 'No doctor data yet' }}
              scroll={{ x: 400 }}
            />
          </DataCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DataCard>
            <SectionTitle variant="h6">Prescriptions by Doctor</SectionTitle>
            <Table
              dataSource={perPrescriptionDoctor}
              columns={perPrescriptionDoctorColumns}
              rowKey="doctor_id"
              pagination={false}
              size="small"
              loading={loading}
              locale={{ emptyText: 'No prescription data yet' }}
              scroll={{ x: 400 }}
            />
          </DataCard>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default DashboardPage;