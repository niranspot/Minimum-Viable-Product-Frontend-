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
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import styled from "styled-components";
import useStaff from "../../modules/staff/hooks/useStaff";

// ─── Styled (structural / layout only — controls stay MUI) ───────────────────

const PageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
`;

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 640px;
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

const Surface = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 12px;
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

// ─── Status chip ─────────────────────────────────────────────────────────────

const StatusChip = ({ status }) => (
  <Chip
    label={status === "active" ? "Active" : "Inactive"}
    color={status === "active" ? "success" : "default"}
    size="small"
    sx={{ fontWeight: 600, textTransform: "capitalize" }}
  />
);

// ─── Create staff dialog ──────────────────────────────────────────────────────
// Staff profiles attach to an existing (non-patient) user account, per the
// backend contract: POST /staff expects { user_id, specialization }.

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
      <DialogTitle>Add Staff Profile</DialogTitle>
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
      <DialogTitle>Edit Staff — {staff?.name}</DialogTitle>
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
// Staff & Role Management — admin only (per StaffController: store/update/destroy
// all gate on ['admin']; index/show also allow doctor/nurse to view).

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

  return (
    <Box>
      <PageHeader>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Manage staff profiles, specializations, and active status
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={fetchStaff} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              clearError();
              setCreateOpen(true);
            }}
          >
            Add Staff
          </Button>
        </Stack>
      </PageHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Surface>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : list.length === 0 ? (
          <EmptyState>
            <GroupIcon sx={{ fontSize: 40, opacity: 0.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              No staff profiles yet
            </Typography>
            <Typography variant="body2">
              Add a staff profile to get started.
            </Typography>
          </EmptyState>
        ) : (
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.name}</td>
                    <td>{staff.email}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {staff.role}
                    </td>
                    <td>{staff.specialization || "—"}</td>
                    <td>
                      <StatusChip status={staff.status} />
                    </td>
                    <td>
                      {staff.created_at
                        ? new Date(staff.created_at).toLocaleDateString()
                        : "—"}
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
      </Surface>

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
    </Box>
  );
};

export default StaffPage;
