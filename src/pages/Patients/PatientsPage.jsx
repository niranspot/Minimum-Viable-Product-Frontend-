import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Tooltip, CircularProgress, Alert,
} from '@mui/material';
import { Table, Input, Tag } from 'antd';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import styled     from 'styled-components';
import usePatients from '../../modules/patients/hooks/usePatients';
import { useSelector } from 'react-redux';

// ── Styled Components ──────────────────────────────────────────
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
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ color }) => color || '#1565C0'};
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

// ── Gender tag colors ──────────────────────────────────────────
const genderColor = { male: 'blue', female: 'pink', other: 'default' };

// ── Default form state ─────────────────────────────────────────
const emptyForm = {
  user_id: '',
  blood_group: '',
  dob: '',
  gender: '',
  address: '',
  emergency_contact: '',
};

// ── Component ──────────────────────────────────────────────────
const PatientsPage = () => {
  const { list, loading, error, success, fetchPatients, createPatient, updatePatient, deletePatient, clearStatus } = usePatients();
  const { user } = useSelector((s) => s.auth);

  const [search,     setSearch]     = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);   // patient object for edit
  const [deleteId,   setDeleteId]   = useState(null);
  const [form,       setForm]       = useState(emptyForm);

  // Fetch on mount
  useEffect(() => { fetchPatients(); }, []);

  // Close modal on success
  useEffect(() => {
    if (success) {
      setModalOpen(false);
      setDeleteOpen(false);
      setForm(emptyForm);
      setEditTarget(null);
      // Clear after 3s
      const t = setTimeout(clearStatus, 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // ── Filtered list ──────────────────────────────────────────
  const filtered = list.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.gender?.toLowerCase().includes(term)
    );
  });

  // ── Handlers ──────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditTarget(record);
    setForm({
      user_id:           record.user_id || '',
      blood_group:       record.blood_group || '',
      dob:               record.dob || '',
      gender:            record.gender || '',
      address:           record.address || '',
      emergency_contact: record.emergency_contact || '',
    });
    setModalOpen(true);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (!form.user_id && !editTarget) return;
    if (editTarget) {
      const { user_id, ...updateData } = form; // user_id not sent on update
      updatePatient(editTarget.id, updateData);
    } else {
      createPatient(form);
    }
  };

  const handleDelete = () => deletePatient(deleteId);

  // ── Stats ─────────────────────────────────────────────────
  const total  = list.length;
  const males  = list.filter((p) => p.gender === 'male').length;
  const females = list.filter((p) => p.gender === 'female').length;

  // ── Ant Design Table Columns ──────────────────────────────
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, rec) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{name || '—'}</Typography>
          <Typography variant="caption" color="text.secondary">{rec.email}</Typography>
        </Box>
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (g) => g ? <Tag color={genderColor[g] || 'default'}>{g}</Tag> : '—',
    },
    {
      title: 'Blood Group',
      dataIndex: 'blood_group',
      key: 'blood_group',
      render: (v) => v ? <Chip label={v} size="small" color="error" variant="outlined" /> : '—',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (v) => v || '—',
    },
    {
      title: 'Emergency Contact',
      dataIndex: 'emergency_contact',
      key: 'emergency_contact',
      render: (v) => v || '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEdit(record)} sx={{ color: '#1565C0' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => openDelete(record.id)} sx={{ color: '#C62828' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <PageWrapper>

      {/* Alerts */}
      {error   && <Alert severity="error"   onClose={clearStatus} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={clearStatus} sx={{ mb: 2 }}>{success}</Alert>}

      {/* Stat Cards */}
      <StatsRow>
        <StatCard>
          <StatValue color="#1565C0">{total}</StatValue>
          <StatLabel>Total Patients</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#1976D2">{males}</StatValue>
          <StatLabel>Male</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#7B1FA2">{females}</StatValue>
          <StatLabel>Female</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#2E7D32">{total - males - females}</StatValue>
          <StatLabel>Other / Unknown</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Table Card */}
      <TableCard>
        <TopRow>
          <Typography variant="h4" fontWeight={700}>Patient Records</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              prefix={<SearchIcon style={{ color: '#718096', fontSize: 16 }} />}
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 240, borderRadius: 8 }}
              allowClear
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Add Patient
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

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editTarget ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>

          {!editTarget && (
            <TextField
              label="User ID"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              size="small"
              fullWidth
              required
              helperText="Must be a registered user with role=patient"
            />
          )}

          <TextField
            label="Blood Group"
            value={form.blood_group}
            onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
            size="small"
            fullWidth
            placeholder="e.g. O+"
          />

          <TextField
            label="Date of Birth"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            size="small"
            fullWidth
            placeholder="YYYY-MM-DD"
          />

          <TextField
            select
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            size="small"
            fullWidth
          >
            <MenuItem value="">Select gender</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <TextField
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            size="small"
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Emergency Contact"
            value={form.emergency_contact}
            onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })}
            size="small"
            fullWidth
            placeholder="Name / Phone"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={14} />}
          >
            {editTarget ? 'Save Changes' : 'Create Patient'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Delete Patient</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this patient? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            startIcon={loading && <CircularProgress size={14} />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </PageWrapper>
  );
};

export default PatientsPage;