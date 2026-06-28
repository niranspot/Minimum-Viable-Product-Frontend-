import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Tooltip, CircularProgress, Alert,
} from '@mui/material';
import { Table, Tag, Input } from 'antd';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import styled     from 'styled-components';
import useAppointments from '../../modules/appointments/hooks/useAppointments';
import { useSelector } from 'react-redux';

// ── Styled ────────────────────────────────────────────────────
const PageWrapper = styled.div`
  background: ${({ theme }) => theme.bg};
  min-height: 100%;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 12px;
  padding: 16px 24px;
  flex: 1;
  min-width: 130px;
`;

const StatValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: ${({ color }) => color || '#1565C0'};
`;

const StatLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 2px;
`;

const TableCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 12px;
  padding: 20px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
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
  const { list, loading, error, success, fetchAppointments, createAppointment, updateAppointment, clearStatus } = useAppointments();
  const { user } = useSelector((s) => s.auth);
  const isPatient = user?.role === 'patient';

  const [search,    setSearch]    = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget,setEditTarget]= useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchAppointments(); }, []);

  useEffect(() => {
    if (success) {
      setModalOpen(false);
      setForm(emptyForm);
      setEditTarget(null);
      const t = setTimeout(clearStatus, 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // ── Filtered ────────────────────────────────────────────────
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
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

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
      // Patient can only cancel — enforce client-side
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
      createAppointment(form);
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
      render: (s) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
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
        return (
          <Tooltip title={isDone ? 'Cannot modify' : 'Edit'}>
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

      {error   && <Alert severity="error"   onClose={clearStatus} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={clearStatus} sx={{ mb: 2 }}>{success}</Alert>}

      {/* Stats */}
      <StatsRow>
        <StatCard><StatValue color="#F59E0B">{pending}</StatValue><StatLabel>Pending</StatLabel></StatCard>
        <StatCard><StatValue color="#1565C0">{confirmed}</StatValue><StatLabel>Confirmed</StatLabel></StatCard>
        <StatCard><StatValue color="#2E7D32">{completed}</StatValue><StatLabel>Completed</StatLabel></StatCard>
        <StatCard><StatValue color="#C62828">{cancelled}</StatValue><StatLabel>Cancelled</StatLabel></StatCard>
      </StatsRow>

      {/* Table */}
      <TableCard>
        <TopRow>
          <Typography variant="h4" fontWeight={700}>Appointments</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input
              prefix={<SearchIcon style={{ color: '#718096', fontSize: 16 }} />}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200, borderRadius: 8 }}
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
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            {!isPatient && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                New Appointment
              </Button>
            )}
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
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>
          {editTarget
            ? isPatient ? 'Cancel Appointment' : 'Update Appointment'
            : 'New Appointment'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>

          {/* Patient cancelling — just confirm */}
          {editTarget && isPatient ? (
            <Typography>Are you sure you want to cancel this appointment?</Typography>
          ) : (
            <>
              {!editTarget && (
                <>
                  <TextField label="Patient ID" value={form.patient_id}
                    onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                    size="small" fullWidth required />
                  <TextField label="Doctor ID" value={form.doctor_id}
                    onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                    size="small" fullWidth required />
                </>
              )}

              <TextField
                label="Appointment Date & Time"
                value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                size="small" fullWidth
                placeholder="YYYY-MM-DD HH:MM:SS"
              />

              {editTarget && (
                <TextField select label="Status" value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  size="small" fullWidth>
                  {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
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
            startIcon={loading && <CircularProgress size={14} />}>
            {editTarget && isPatient ? 'Confirm Cancel' : editTarget ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

    </PageWrapper>
  );
};

export default AppointmentsPage;