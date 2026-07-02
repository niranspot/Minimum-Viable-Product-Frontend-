import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Stack,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BadgeIcon from "@mui/icons-material/Badge";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EventIcon from "@mui/icons-material/Event";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import styled from "styled-components";
import useStaff from "../../modules/staff/hooks/useStaff";

// ─── Page chrome (mirrors PatientsPage: Hero, StatsRow/StatCard, TableCard) ───

const PageWrapper = styled.div`
  background: ${({ theme }) => theme.bg};
  min-height: 100%;
`;

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
    linear-gradient(110deg, #065F46 0%, #0D9488 35%, rgba(13,148,136,0.55) 65%, rgba(13,148,136,0.1) 100%),
    url('https://source.unsplash.com/1600x600/?hospital,team,medical,staff');
  background-size: cover;
  background-position: center;
`;

const HeroShield = styled(GroupIcon)`
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

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;

  thead th {
    text-align: left;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: ${({ theme }) => theme.textMuted};
    padding: 10px 14px;
    border-bottom: 1px solid ${({ theme }) => theme.divider};
    white-space: nowrap;
  }

  tbody td {
    padding: 12px 14px;
    font-size: 14px;
    color: ${({ theme }) => theme.text};
    border-bottom: 1px solid ${({ theme }) => theme.divider};
    white-space: nowrap;
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.bg};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 16px;
  color: ${({ theme }) => theme.textMuted};
  text-align: center;
`;

// Pill chip used inside table cells (same pattern as PatientsPage)
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

// ─── Status pill ─────────────────────────────────────────────────────────────

const StatusPill = ({ status }) =>
  status === "active" ? (
    <Pill bg="#D1FAE5" color="#059669">
      <CheckCircleOutlineIcon style={{ fontSize: 13 }} />
      Active
    </Pill>
  ) : (
    <Pill bg="#FEE2E2" color="#B91C1C">
      <CancelOutlinedIcon style={{ fontSize: 13 }} />
      Inactive
    </Pill>
  );

// ─── Create staff dialog ──────────────────────────────────────────────────────
// Staff profiles attach to an existing (non-patient) user account, per the
// backend contract: POST /staff expects { user_id, specialization }.
// (Unchanged from the working version — logic not touched.)

const CreateStaffDialog = ({ open, onClose, onCreate, loading, error }) => {
  const [form, setForm] = useState({ user_id: "", specialization: "" });

  useEffect(() => {
    if (open) setForm({ user_id: "", specialization: "" });
  }, [open]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const isValid = Boolean(form.user_id);

  const handleSubmit = () => {
    if (!isValid) return;
    onCreate({
      user_id: Number(form.user_id),
      specialization: form.specialization.trim() || null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Add Staff Profile</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="User ID"
            type="number"
            fullWidth
            required
            value={form.user_id}
            onChange={handleChange("user_id")}
            helperText="The existing (non-patient) user account this staff profile belongs to"
          />
          <TextField
            label="Specialization"
            fullWidth
            value={form.specialization}
            onChange={handleChange("specialization")}
            placeholder="e.g. Cardiology, Pediatric Nursing"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValid || loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Add Staff"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Edit specialization dialog ───────────────────────────────────────────────
// (Unchanged from the working version — logic not touched.)

const EditStaffDialog = ({ open, staff, onClose, onSave, loading, error }) => {
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    if (open && staff) setSpecialization(staff.specialization || "");
  }, [open, staff]);

  const handleSubmit = () => {
    if (!staff) return;
    onSave(staff.id, { specialization: specialization.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        Edit Staff — {staff?.name}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Specialization"
          fullWidth
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Row action menu ──────────────────────────────────────────────────────────
// (Unchanged from the working version — logic not touched.)

const StaffActionsMenu = ({ staff, onEdit, onToggleStatus, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            onEdit(staff);
            setAnchorEl(null);
          }}
        >
          Edit specialization
        </MenuItem>
        <MenuItem
          onClick={() => {
            onToggleStatus(staff);
            setAnchorEl(null);
          }}
        >
          Mark as {staff.status === "active" ? "Inactive" : "Active"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(staff);
            setAnchorEl(null);
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Remove
        </MenuItem>
      </Menu>
    </>
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────

const StaffPage = () => {
  const {
    list,
    loading,
    error,
    actionLoading,
    actionError,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    clearError,
  } = useStaff();

  const [createOpen, setCreateOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevListLength = React.useRef(list.length);
  useEffect(() => {
    if (
      createOpen &&
      !actionLoading &&
      !actionError &&
      list.length > prevListLength.current
    ) {
      setCreateOpen(false);
    }
    prevListLength.current = list.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length, actionLoading, actionError]);

  const handleCreate = (data) => createStaff(data);

  const handleSaveEdit = (id, data) => {
    updateStaff(id, data);
    setEditStaff(null);
  };

  const handleToggleStatus = (staff) => {
    updateStaff(staff.id, {
      status: staff.status === "active" ? "inactive" : "active",
    });
  };

  const handleDelete = (staff) => {
    deleteStaff(staff.id);
  };

  // ── Fix: `list` can legitimately contain a null/undefined entry (e.g. a
  // staff profile whose linked user record is missing on the backend),
  // which crashed the render with "Cannot read properties of undefined
  // (reading 'name')". Filtering those out — and using optional chaining
  // as a second safety net below — fixes the crash without touching any
  // fetch/create/update/delete logic. ────────────────────────────────────
  const safeList = (list || []).filter(Boolean);

  const filtered = safeList.filter((s) => {
    const term = search.toLowerCase();
    return (
      s?.name?.toLowerCase().includes(term) ||
      s?.email?.toLowerCase().includes(term) ||
      s?.role?.toLowerCase().includes(term) ||
      s?.specialization?.toLowerCase().includes(term)
    );
  });

  // ── Stats ─────────────────────────────────────────────────────────────
  const total         = safeList.length;
  const activeCount   = safeList.filter((s) => s?.status === "active").length;
  const inactiveCount = safeList.filter((s) => s?.status !== "active").length;
  const specialized   = safeList.filter((s) => s?.specialization).length;

  return (
    <PageWrapper>
      <Hero>
        <HeroShield />
        <HeroText>
          <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 1 }}>
            Staff &amp; Role Management
          </Typography>
          <Typography sx={{ fontSize: 14.5, opacity: 0.92, lineHeight: 1.5 }}>
            Manage staff profiles, specializations, and active status across your tenant.
          </Typography>
          <HeroBadges>
            <HeroBadge><VerifiedUserIcon style={{ fontSize: 16 }} /> Role-Based Access</HeroBadge>
            <HeroBadge><FactCheckIcon style={{ fontSize: 16 }} /> Live Status Tracking</HeroBadge>
            <HeroBadge><BadgeIcon style={{ fontSize: 16 }} /> Secure Profiles</HeroBadge>
          </HeroBadges>
        </HeroText>
      </Hero>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StatsRow>
        <StatCard accent="#0D9488">
          <StatIconWrap bg="#CCFBF1" color="#0D9488"><GroupIcon /></StatIconWrap>
          <Box><StatValue>{total}</StatValue><StatLabel>Total Staff</StatLabel></Box>
        </StatCard>
        <StatCard accent="#059669">
          <StatIconWrap bg="#D1FAE5" color="#059669"><CheckCircleOutlineIcon /></StatIconWrap>
          <Box><StatValue>{activeCount}</StatValue><StatLabel>Active</StatLabel></Box>
        </StatCard>
        <StatCard accent="#B91C1C">
          <StatIconWrap bg="#FEE2E2" color="#B91C1C"><CancelOutlinedIcon /></StatIconWrap>
          <Box><StatValue>{inactiveCount}</StatValue><StatLabel>Inactive</StatLabel></Box>
        </StatCard>
        <StatCard accent="#7C3AED">
          <StatIconWrap bg="#EDE9FE" color="#7C3AED"><WorkspacePremiumIcon /></StatIconWrap>
          <Box><StatValue>{specialized}</StatValue><StatLabel>Specialized</StatLabel></Box>
        </StatCard>
      </StatsRow>

      <TableCard>
        <TopRow>
          <TitleGroup>
            <GroupIcon sx={{ color: "#0D9488" }} />
            <Typography variant="h6" fontWeight={800}>Staff Directory</Typography>
          </TitleGroup>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "text.secondary", fontSize: 18, mr: 1 }} />,
              }}
              sx={{ width: 230, "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
            />
            <Tooltip title="Refresh">
              <span>
                <RoundIconButton size="small" onClick={fetchStaff} disabled={loading}>
                  <RefreshIcon fontSize="small" />
                </RoundIconButton>
              </span>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                clearError();
                setCreateOpen(true);
              }}
              sx={{
                borderRadius: 999, textTransform: "none", fontWeight: 700, px: 2.4,
                background: "linear-gradient(120deg,#10b981,#059669)",
                boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
                "&:hover": { background: "linear-gradient(120deg,#059669,#047857)" },
              }}
            >
              Add Staff
            </Button>
          </Box>
        </TopRow>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} sx={{ color: "#0D9488" }} />
          </Box>
        ) : filtered.length === 0 ? (
          <EmptyState>
            <GroupIcon sx={{ fontSize: 40, opacity: 0.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              No staff profiles found
            </Typography>
            <Typography variant="body2">
              {safeList.length === 0
                ? "Add a staff profile to get started."
                : "Try a different search term."}
            </Typography>
          </EmptyState>
        ) : (
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Role</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((staff, i) => (
                  <tr key={staff?.id ?? `row-${i}`}>
                    <td>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
                        <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: "#CCFBF1", color: "#0D9488", fontWeight: 800 }}>
                          {(staff?.name || "?").charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{staff?.name || "—"}</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>{staff?.email || "—"}</Typography>
                        </Box>
                      </Box>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      {staff?.role ? (
                        <Pill bg="#E3F0FF" color="#1565C0">{staff.role}</Pill>
                      ) : "—"}
                    </td>
                    <td>
                      {staff?.specialization ? (
                        <Pill bg="#EDE9FE" color="#7C3AED">
                          <WorkspacePremiumIcon style={{ fontSize: 13 }} />
                          {staff.specialization}
                        </Pill>
                      ) : "—"}
                    </td>
                    <td>
                      <StatusPill status={staff?.status} />
                    </td>
                    <td>
                      {staff?.created_at ? (
                        <Pill bg="#EEF2FF" color="#3730A3">
                          <EventIcon style={{ fontSize: 13 }} />
                          {new Date(staff.created_at).toLocaleDateString()}
                        </Pill>
                      ) : "—"}
                    </td>
                    <td>
                      <StaffActionsMenu
                        staff={staff}
                        onEdit={setEditStaff}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </TableCard>

      <CreateStaffDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        loading={actionLoading}
        error={actionError}
      />

      <EditStaffDialog
        open={Boolean(editStaff)}
        staff={editStaff}
        onClose={() => setEditStaff(null)}
        onSave={handleSaveEdit}
        loading={actionLoading}
        error={actionError}
      />
    </PageWrapper>
  );
};

export default StaffPage;