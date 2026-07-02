import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Tooltip, CircularProgress, Alert,
} from '@mui/material';
import { Table, Tag, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
import AddIcon         from '@mui/icons-material/Add';
import EditIcon        from '@mui/icons-material/Edit';
import SearchIcon      from '@mui/icons-material/Search';
import RefreshIcon     from '@mui/icons-material/Refresh';
import HourglassIcon   from '@mui/icons-material/HourglassEmpty';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon      from '@mui/icons-material/Cancel';
import ShieldIcon      from '@mui/icons-material/Shield';
import styled, { createGlobalStyle } from 'styled-components';
import useAppointments from '../../modules/appointments/hooks/useAppointments';
import { useSelector }  from 'react-redux';

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
    linear-gradient(120deg, rgba(27,138,90,0.92) 10%, rgba(27,138,90,0.55) 60%, rgba(27,138,90,0.15) 100%),
    url('https://source.unsplash.com/1600x500/?medical,calendar,appointment');
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

// MUI Dialog renders at z-index 1300; AntD's DatePicker dropdown portal
// defaults lower than that, so it ends up visually behind the dialog.
// Also scale the popup down slightly — with showTime enabled it gets tall
// enough that the panel border / OK button can get clipped off-screen.
const AntdPopupZIndexFix = createGlobalStyle`
  .ant-picker-dropdown {
    z-index: 1400 !important;
  }

  .ant-picker-dropdown .ant-picker-panel-container {
    font-size: 12px !important;
    max-height: 320px !important;
  }

  .ant-picker-dropdown .ant-picker-datetime-panel {
    max-height: 320px !important;
  }

  .ant-picker-dropdown .ant-picker-date-panel,
  .ant-picker-dropdown .ant-picker-time-panel {
    max-height: 320px !important;
    overflow: hidden !important;
  }

  .ant-picker-dropdown .ant-picker-header {
    padding: 4px 8px !important;
  }

  .ant-picker-dropdown .ant-picker-cell .ant-picker-cell-inner {
    width: 22px !important;
    height: 22px !important;
    line-height: 22px !important;
  }

  .ant-picker-dropdown .ant-picker-body {
    padding: 4px 8px !important;
  }

  .ant-picker-dropdown .ant-picker-content th,
  .ant-picker-dropdown .ant-picker-content td {
    padding: 0 !important;
  }

  .ant-picker-dropdown .ant-picker-time-panel-column {
    width: 44px !important;
  }

  .ant-picker-dropdown .ant-picker-time-panel-column .ant-picker-time-panel-cell-inner {
    height: 22px !important;
    line-height: 22px !important;
    padding: 0 0 0 12px !important;
  }

  .ant-picker-dropdown .ant-picker-footer {
    padding: 4px 8px !important;
    min-width: 0 !important;
  }

  .ant-picker-dropdown .ant-picker-footer .ant-picker-ok button {
    height: 22px !important;
    padding: 0 10px !important;
    font-size: 12px !important;
  }
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

// ── Page layout ─────────────────────────────────────────────────
const PageWrapper = styled.div`
  background: ${({ theme }) => theme.bg};
  min-height: 100%;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 16px;
  padding: 20px 22px 18px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    background: ${({ accent }) => accent};
  }
`;

const StatIconWrap = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
`;

const StatValue = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  line-height: 1.1;
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 3px;
`;

const TableCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 16px;
  padding: 22px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 12px;
  flex-wrap: wrap;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RoundIconButton = styled(IconButton)`
  border: 1px solid ${({ theme }) => theme.divider} !important;
  border-radius: 10px !important;
`;

// ── Status config ─────────────────────────────────────────────
const statusColor = {
  pending:   'orange',
  confirmed: 'blue',
  cancelled: 'red',
  completed: 'green',
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const emptyForm = {
  patient_id:       '',
  doctor_id:        '',
  appointment_date: '',
  notes:            '',
  status:           'pending',
};

// ── Component ─────────────────────────────────────────────────
const AppointmentsPage = () => {
  const {
    list, loading, error, success, isOnline, queue, syncing, patients,doctors,
    fetchAppointments, createAppointment, updateAppointment, clearStatus, fetchDropdownLists,
  } = useAppointments();
  const { user } = useSelector((s) => s.auth);
  const isPatient = user?.role === 'patient';

  const [search,     setSearch]     = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { 
    fetchAppointments();
    if (user?.role) {
      fetchDropdownLists(user.role); 
    }
    }, []);

  useEffect(() => {
    if (success) {
      setModalOpen(false);
      setForm(emptyForm);
      setEditTarget(null);
      const t = setTimeout(clearStatus, 3000);
      return () => clearTimeout(t);
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = list.filter((a) => {
    const term = search.toLowerCase();
    const matchSearch =
      a.doctor_name?.toLowerCase().includes(term)  ||
      a.patient_name?.toLowerCase().includes(term) ||
      a.status?.toLowerCase().includes(term);
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  // ── Stats ───────────────────────────────────────────────────
  const pending   = list.filter((a) => a.status === 'pending').length;
  const confirmed = list.filter((a) => a.status === 'confirmed').length;
  const completed = list.filter((a) => a.status === 'completed').length;
  const cancelled = list.filter((a) => a.status === 'cancelled').length;

  // ── Handlers ────────────────────────────────────────────────
  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };

  const openEdit = (record) => {
    setEditTarget(record);
    setForm({
      patient_id:       record.patient_id || '',
      doctor_id:        record.doctor_id  || '',
      appointment_date: record.appointment_date || '',
      notes:            record.notes || '',
      status:           record.status || 'pending',
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (editTarget) {
      // Patient can only cancel — enforced client-side to match backend rule
      if (isPatient) {
        updateAppointment(editTarget.id, { status: 'cancelled', appointment_date: editTarget.appointment_date });
      } else {
        updateAppointment(editTarget.id, {
          status:           form.status,
          appointment_date: form.appointment_date,
          notes:            form.notes,
        });
      }
    } else {
      // patient_id is auto-resolved server-side from the JWT for the patient role
      const payload = isPatient
        ? { doctor_id: form.doctor_id, appointment_date: form.appointment_date, notes: form.notes }
        : form;
      createAppointment(payload);
    }
  };

  // ── Table columns ────────────────────────────────────────────
  const columns = [
    {
      title: 'Doctor',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
      render: (v) => <Typography variant="body2" fontWeight={600}>{v || '—'}</Typography>,
    },
    !isPatient && {
      title: 'Patient',
      dataIndex: 'patient_name',
      key: 'patient_name',
      render: (v) => v || '—',
    },
    {
      title: 'Date & Time',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      render: (v) => v ? new Date(v).toLocaleString('en-IN') : '—',
      sorter: (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColor[s] || 'default'} style={{ textTransform: 'capitalize' }}>{s}</Tag>,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (v) => v ? (
        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 160, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {v}
        </Typography>
      ) : '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isDone = record.status === 'completed' || record.status === 'cancelled';
        const label = isDone ? 'Cannot modify' : isPatient ? 'Cancel' : 'Edit';
        return (
          <Tooltip title={label}>
            <span>
              <IconButton size="small" onClick={() => openEdit(record)} disabled={isDone} sx={{ color: isDone ? '#ccc' : '#1565C0' }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        );
      },
    },
  ].filter(Boolean);

  return (
    <PageWrapper>
      <AntdPopupZIndexFix />

      <Hero>
        <HeroShield />
        <HeroText>
          <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 1 }}>
            {isPatient ? 'My Appointments' : 'Appointment & Scheduling'}
          </Typography>
          <Typography sx={{ fontSize: 14.5, opacity: 0.92, lineHeight: 1.5 }}>
            {isPatient
              ? 'Book new appointments and track your upcoming visits.'
              : 'Track appointment status across doctors, with conflict-aware scheduling.'}
          </Typography>
          <HeroBadges>
            <HeroBadge><EventAvailableIcon style={{ fontSize: 16 }} /> Real-time Status</HeroBadge>
            <HeroBadge><HourglassIcon style={{ fontSize: 16 }} /> Conflict-aware</HeroBadge>
            <HeroBadge><CheckCircleIcon style={{ fontSize: 16 }} /> Easy Tracking</HeroBadge>
          </HeroBadges>
        </HeroText>
      </Hero>

      {error   && <Alert severity="error"   onClose={clearStatus} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={clearStatus} sx={{ mb: 2 }}>{success}</Alert>}


      {!isOnline && (
  <Alert severity="warning" sx={{ mb: 2 }}>
    You're offline. {queue.length > 0
      ? `${queue.length} appointment(s) are saved locally and will be booked automatically once you're back online.`
      : 'New appointments will be saved locally until your connection returns.'}
  </Alert>
)}

{isOnline && syncing && (
  <Alert severity="info" sx={{ mb: 2 }}>
    Syncing queued appointments...
  </Alert>
)}

{isOnline && !syncing && queue.some((q) => q.status === 'failed') && (
  <Alert severity="error" sx={{ mb: 2 }}>
    Some queued appointments failed to sync and will be retried on your next reconnect.
  </Alert>
)}


      {/* Stats */}
      <StatsRow>
        <StatCard accent="#E65100">
          <StatIconWrap bg="#FFF3E0" color="#E65100"><HourglassIcon /></StatIconWrap>
          <Box><StatValue>{pending}</StatValue><StatLabel>Pending</StatLabel></Box>
        </StatCard>
        <StatCard accent="#1565C0">
          <StatIconWrap bg="#E3F2FD" color="#1565C0"><EventAvailableIcon /></StatIconWrap>
          <Box><StatValue>{confirmed}</StatValue><StatLabel>Confirmed</StatLabel></Box>
        </StatCard>
        <StatCard accent="#2E7D32">
          <StatIconWrap bg="#E8F5E9" color="#2E7D32"><CheckCircleIcon /></StatIconWrap>
          <Box><StatValue>{completed}</StatValue><StatLabel>Completed</StatLabel></Box>
        </StatCard>
        <StatCard accent="#C62828">
          <StatIconWrap bg="#FFEBEE" color="#C62828"><CancelIcon /></StatIconWrap>
          <Box><StatValue>{cancelled}</StatValue><StatLabel>Cancelled</StatLabel></Box>
        </StatCard>
      </StatsRow>

      {/* Table */}
      <TableCard>
        <TopRow>
          <TitleGroup>
            <EventAvailableIcon sx={{ color: '#1B8A5A' }} />
            <Typography variant="h6" fontWeight={800}>Appointments</Typography>
          </TitleGroup>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              prefix={<SearchIcon style={{ color: '#718096', fontSize: 16 }} />}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 230, borderRadius: 999 }}
              allowClear
            />
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ width: 150 }}
              label="Filter status"
            >
              <MenuItem value="">All</MenuItem>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
              ))}
            </TextField>
            <Tooltip title="Refresh">
              <span>
                <RoundIconButton size="small" onClick={fetchAppointments} disabled={loading}>
                  <RefreshIcon fontSize="small" />
                </RoundIconButton>
              </span>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{
                borderRadius: 999, textTransform: 'none', fontWeight: 700, px: 2.4,
                background: 'linear-gradient(120deg,#1B8A5A,#15724A)',
                boxShadow: '0 4px 14px rgba(27,138,90,0.35)',
                '&:hover': { background: 'linear-gradient(120deg,#15724A,#0F5C3C)' },
              }}
            >
              {isPatient ? 'Book Appointment' : 'New Appointment'}
              {queue.length > 0 && ` (${queue.length} queued)`}
            </Button>
          </Box>
        </TopRow>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="middle"
          scroll={{ x: 700 }}
        />
      </TableCard>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editTarget
            ? isPatient ? 'Cancel Appointment' : 'Update Appointment'
            : isPatient ? 'Book Appointment' : 'New Appointment'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>

          {editTarget && isPatient ? (
            <Typography>Are you sure you want to cancel this appointment?</Typography>
          ) : (
            <>
              {!editTarget && (
                <>
                  {/* PATIENT SELECT DROPDOWN (Hidden if the user logged in is already a patient) */}
                  {!isPatient && (
                    <TextField
                      select
                      label="Select Patient"
                      value={form.patient_id}
                      onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                      size="small"
                      fullWidth
                      required
                    >
                      {patients.map((p) => (
                        <MenuItem key={p.patient_id} value={p.patient_id}>
                          {p.name || `ID: ${p.patient_id}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                  {/* DOCTOR SELECT DROPDOWN */}
                  {isPatient &&
                  <TextField
                    select
                    label="Select Doctor"
                    value={form.doctor_id}
                    onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                    size="small"
                    fullWidth
                    required
                    helperText="Select an active doctor within your tenant layout"
                  >
                    {doctors.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        Dr. {d.name || d.id}
                      </MenuItem>
                    ))}
                  </TextField>}
                </>
              )}

              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>
                  Appointment Date & Time
                </Typography>
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                  size="large"
                  placement="bottomLeft"
                  autoAdjustOverflow={false}
                  getPopupContainer={() => document.body}
                  value={form.appointment_date ? dayjs(form.appointment_date) : null}
                  onChange={(date) =>
                    setForm({ ...form, appointment_date: date ? date.format('YYYY-MM-DD HH:mm:ss') : '' })
                  }
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Box>

              {editTarget && !isPatient && (
                <TextField select label="Status" value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  size="small" fullWidth>
                  {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>)}
                </TextField>
              )}

              <TextField
                label="Notes" value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                size="small" fullWidth multiline rows={3}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained"
            color={editTarget && isPatient ? 'error' : 'primary'}
            onClick={handleSubmit} disabled={loading}
            startIcon={loading && <CircularProgress size={14} color="inherit" />}>
            {editTarget && isPatient ? 'Confirm Cancel' : editTarget ? 'Save' : isPatient ? 'Book' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default AppointmentsPage;