import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Tooltip, CircularProgress, Alert, Avatar,
} from '@mui/material';
import { Table, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
import AddIcon            from '@mui/icons-material/Add';
import EditIcon            from '@mui/icons-material/Edit';
import DeleteIcon          from '@mui/icons-material/Delete';
import SearchIcon          from '@mui/icons-material/Search';
import RefreshIcon         from '@mui/icons-material/Refresh';
import FilterListIcon      from '@mui/icons-material/FilterList';
import PeopleAltIcon       from '@mui/icons-material/PeopleAlt';
import MaleIcon            from '@mui/icons-material/Male';
import FemaleIcon          from '@mui/icons-material/Female';
import BloodtypeIcon       from '@mui/icons-material/Bloodtype';
import VerifiedUserIcon    from '@mui/icons-material/VerifiedUser';
import TravelExploreIcon   from '@mui/icons-material/TravelExplore';
import HowToRegIcon        from '@mui/icons-material/HowToReg';
import EventIcon           from '@mui/icons-material/Event';
import PhoneIcon           from '@mui/icons-material/Phone';
import ShieldIcon          from '@mui/icons-material/Shield';
import styled, { createGlobalStyle } from 'styled-components';
import usePatients         from '../../modules/patients/hooks/usePatients';

// MUI Dialog renders at z-index 1300; AntD's DatePicker dropdown portal
// defaults lower than that, so it ends up visually behind the dialog.
// Also scale the popup down slightly so it fits cleanly without its
// border/footer getting clipped.
const AntdPopupZIndexFix = createGlobalStyle`
  .ant-picker-dropdown {
    z-index: 1400 !important;
  }

  .ant-picker-dropdown .ant-picker-panel-container {
    transform: scale(0.78);
    transform-origin: top left;
  }
`;

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ── Hero banner ──────────────────────────────────────────────────
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
    linear-gradient(110deg, #1E3A8A 0%, #1D4ED8 35%, rgba(29,78,216,0.55) 65%, rgba(29,78,216,0.1) 100%),
    url('https://source.unsplash.com/1600x600/?hospital,corridor,doctor,nurse');
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
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
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

// ── Pill chip used inside table cells ─────────────────────────
const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  white-space: nowrap;
`;

// ── Default form state ─────────────────────────────────────────
const emptyForm = {
  user_id: '',
  blood_group: '',
  dob: '',
  gender: '',
  address: '',
  emergency_contact: '',
};

const genderStyle = {
  male:   { bg: '#E3F2FD', color: '#1565C0', icon: <MaleIcon style={{ fontSize: 13 }} /> },
  female: { bg: '#FCE4EC', color: '#AD1457', icon: <FemaleIcon style={{ fontSize: 13 }} /> },
  other:  { bg: '#F1F1F1', color: '#555',    icon: null },
};

// ── Component ──────────────────────────────────────────────────
const PatientsPage = () => {
  const {
    list, loading, error, success,
    fetchPatients, createPatient, updatePatient, deletePatient, clearStatus, fetchDropdownLists, patients
  } = usePatients();

  const [search,     setSearch]     = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [form,       setForm]       = useState(emptyForm);

  useEffect(() => { 
    fetchPatients();
    fetchDropdownLists();
   }, []); 

  useEffect(() => {
    if (success) {
      setModalOpen(false);
      setDeleteOpen(false);
      setForm(emptyForm);
      setEditTarget(null);
      const t = setTimeout(clearStatus, 3000);
      return () => clearTimeout(t);
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = list.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.gender?.toLowerCase().includes(term) ||
      p.blood_group?.toLowerCase().includes(term)
    );
  });

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };

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

  const openDelete = (id) => { setDeleteId(id); setDeleteOpen(true); };

  const handleSubmit = () => {
    if (!form.user_id && !editTarget) return;
    if (editTarget) {
      const { user_id, ...updateData } = form; // user_id immutable on update
      updatePatient(editTarget.id, updateData);
    } else {
      createPatient(form);
    }
  };

  const handleDelete = () => deletePatient(deleteId);

  // ── Stats ─────────────────────────────────────────────────
  const total   = list.length;
  const males   = list.filter((p) => p.gender === 'male').length;
  const females = list.filter((p) => p.gender === 'female').length;
  const withBloodGroup = list.filter((p) => p.blood_group).length;

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'name',
      key: 'name',
      render: (name, rec) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
          <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: '#E3F0FF', color: '#1565C0', fontWeight: 800 }}>
            {(name || '?').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700}>{name || '—'}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{rec.email}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (g) => {
        const s = genderStyle[g];
        if (!s) return '—';
        return (
          <Pill bg={s.bg} color={s.color}>
            {s.icon}
            <span style={{ textTransform: 'capitalize' }}>{g}</span>
          </Pill>
        );
      },
    },
    {
      title: 'Blood Group',
      dataIndex: 'blood_group',
      key: 'blood_group',
      render: (v) => v ? (
        <Pill bg="#FFEBEE" color="#C62828">
          <BloodtypeIcon style={{ fontSize: 13 }} />
          {v}
        </Pill>
      ) : '—',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (v) => v ? (
        <Pill bg="#EEF2FF" color="#3730A3">
          <EventIcon style={{ fontSize: 13 }} />
          {v}
        </Pill>
      ) : '—',
    },
    {
      title: 'Emergency Contact',
      dataIndex: 'emergency_contact',
      key: 'emergency_contact',
      render: (v) => v ? (
        <Pill bg="#ECFDF5" color="#047857">
          <PhoneIcon style={{ fontSize: 13 }} />
          {v}
        </Pill>
      ) : '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 0.7 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEdit(record)}
              sx={{ color: '#1565C0', bgcolor: '#E3F0FF', '&:hover': { bgcolor: '#D0E4FF' } }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => openDelete(record.id)}
              sx={{ color: '#C62828', bgcolor: '#FFEBEE', '&:hover': { bgcolor: '#FFD7D7' } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <PageWrapper>
      <AntdPopupZIndexFix />

      <Hero>
        <HeroShield />
        <HeroText>
          <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 1 }}>Patient Management</Typography>
          <Typography sx={{ fontSize: 14.5, opacity: 0.92, lineHeight: 1.5 }}>
            View, edit, register and maintain encrypted patient health records.
          </Typography>
          <HeroBadges>
            <HeroBadge><VerifiedUserIcon style={{ fontSize: 16 }} /> Secure Records</HeroBadge>
            <HeroBadge><TravelExploreIcon style={{ fontSize: 16 }} /> Easy Search</HeroBadge>
            <HeroBadge><HowToRegIcon style={{ fontSize: 16 }} /> Quick Registration</HeroBadge>
          </HeroBadges>
        </HeroText>
      </Hero>

      {error   && <Alert severity="error"   onClose={clearStatus} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={clearStatus} sx={{ mb: 2 }}>{success}</Alert>}

      <StatsRow>
        <StatCard accent="#1565C0">
          <StatIconWrap bg="#E3F0FF" color="#1565C0"><PeopleAltIcon /></StatIconWrap>
          <Box><StatValue>{total}</StatValue><StatLabel>Total Patients</StatLabel></Box>
        </StatCard>
        <StatCard accent="#1976D2">
          <StatIconWrap bg="#E3F2FD" color="#1976D2"><MaleIcon /></StatIconWrap>
          <Box><StatValue>{males}</StatValue><StatLabel>Male</StatLabel></Box>
        </StatCard>
        <StatCard accent="#AD1457">
          <StatIconWrap bg="#FCE4EC" color="#AD1457"><FemaleIcon /></StatIconWrap>
          <Box><StatValue>{females}</StatValue><StatLabel>Female</StatLabel></Box>
        </StatCard>
        <StatCard accent="#C62828">
          <StatIconWrap bg="#FFEBEE" color="#C62828"><BloodtypeIcon /></StatIconWrap>
          <Box><StatValue>{withBloodGroup}</StatValue><StatLabel>Blood Group on File</StatLabel></Box>
        </StatCard>
      </StatsRow>

      <TableCard>
        <TopRow>
          <TitleGroup>
            <PeopleAltIcon sx={{ color: '#1565C0' }} />
            <Typography variant="h6" fontWeight={800}>Patient Records</Typography>
          </TitleGroup>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              prefix={<SearchIcon style={{ color: '#718096', fontSize: 16 }} />}
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 230, borderRadius: 999 }}
              allowClear
            />
            
            <Tooltip title="Refresh">
              <span>
                <RoundIconButton size="small" onClick={fetchPatients} disabled={loading}>
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
                background: 'linear-gradient(120deg,#1D4ED8,#1565C0)',
                boxShadow: '0 4px 14px rgba(29,78,216,0.35)',
                '&:hover': { background: 'linear-gradient(120deg,#1E40AF,#0D47A1)' },
              }}
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
          scroll={{ x: 760 }}
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
  select // ◄── Changes this into a dropdown select menu
  label="Select Patient"
  value={form.user_id} // ◄── Keeps your exact structural binding
  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
  size="small"
  fullWidth
  required
  helperText="Must be an active, registered user with role = patient"
>
  {patients.map((p) => (
    <MenuItem key={p.id} value={p.id}>
      {p.name || `Patient ID: ${p.id}`}
    </MenuItem>
  ))}
</TextField>
          )}

          <TextField
            select
            label="Blood Group"
            value={form.blood_group}
            onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
            size="small"
            fullWidth
          >
            <MenuItem value="">Select blood group</MenuItem>
            {BLOOD_GROUPS.map((bg) => (
              <MenuItem key={bg} value={bg}>{bg}</MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>
              Date of Birth
            </Typography>
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              size="large"
              value={form.dob ? dayjs(form.dob) : null}
              onChange={(date) => setForm({ ...form, dob: date ? date.format('YYYY-MM-DD') : '' })}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Box>

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
            startIcon={loading && <CircularProgress size={14} color="inherit" />}
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
            startIcon={loading && <CircularProgress size={14} color="inherit" />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default PatientsPage;