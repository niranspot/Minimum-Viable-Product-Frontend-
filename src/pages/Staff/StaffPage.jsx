import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Stack,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupIcon from "@mui/icons-material/Group";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import MedicationIcon from "@mui/icons-material/Medication";
import HealingIcon from "@mui/icons-material/Healing";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import useStaff from "../../modules/staff/hooks/useStaff";

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active: {
    label: "Active",
    bg: "linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)",
    color: "#fff",
    border: "rgba(72,198,239,0.4)",
  },
  inactive: {
    label: "Inactive",
    bg: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    color: "#fff",
    border: "rgba(255,8,68,0.4)",
  },
};

// ─── Role Banner ─────────────────────────────────────────────────────────────

const RoleBanner = ({ role }) => {
  if (role !== "admin") return null;
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        borderRadius: "16px",
        padding: "14px 20px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#fff",
        boxShadow: "0 4px 20px rgba(245,87,108,0.3)",
        animation: "slideDown 0.4s ease",
      }}
    >
      <span style={{ display: "flex", fontSize: "22px" }}><AdminPanelSettingsIcon /></span>
      <div>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>Administrator View</div>
        <div style={{ fontSize: "13px", opacity: 0.9 }}>
          You have full access to manage staff profiles, roles, and system access. Note: Staff listings are safely isolated per tenant.
        </div>
      </div>
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || {
    label: status,
    bg: "#e0e0e0",
    color: "#555",
    border: "#ccc",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 12px",
        borderRadius: "20px",
        background: cfg.bg,
        color: cfg.color,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        border: `1px solid ${cfg.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        whiteSpace: "nowrap",
      }}
    >
      {status?.toLowerCase() === "active" && <CheckCircleOutlineIcon style={{ fontSize: "14px" }} />}
      {status?.toLowerCase() === "inactive" && <CancelOutlinedIcon style={{ fontSize: "14px" }} />}
      {cfg.label}
    </span>
  );
};

// ─── Actions Menu ────────────────────────────────────────────────────────────

const StaffActionsMenu = ({ staff, onEdit, onToggleStatus, onDelete }) => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setAnchor(e.currentTarget);
        }}
        sx={{
          color: "text.secondary",
          "&:hover": { background: "rgba(102,126,234,0.1)" },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            border: "1px solid rgba(102,126,234,0.15)",
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit(staff);
            setAnchor(null);
          }}
          sx={{ gap: 1, color: "#1d4ed8", fontWeight: 500 }}
        >
          <EditOutlinedIcon fontSize="small" />
          Edit Staff details
        </MenuItem>
        
        <MenuItem
           onClick={() => {
             onToggleStatus(staff);
             setAnchor(null);
           }}
           sx={{ gap: 1, color: staff.status === "active" ? "#dc2626" : "#059669", fontWeight: 500 }}
        >
           {staff.status === "active" ? <CancelOutlinedIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
           Mark as {staff.status === "active" ? "Inactive" : "Active"}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDelete(staff);
            setAnchor(null);
          }}
          sx={{ gap: 1, color: "#dc2626", fontWeight: 500 }}
        >
          <DeleteOutlineIcon fontSize="small" />
          Delete Staff
        </MenuItem>
      </Menu>
    </>
  );
};

// ─── Staff Card ──────────────────────────────────────────────────────────────

const getRoleIcon = (role) => {
  switch (role) {
    case 'doctor': return <MedicationIcon fontSize="inherit" />;
    case 'pharmacist': return <LocalHospitalIcon fontSize="inherit" />;
    case 'nurse': return <HealingIcon fontSize="inherit" />;
    case 'receptionist': return <ContactPhoneIcon fontSize="inherit" />;
    default: return <GroupIcon fontSize="inherit" />;
  }
};

const StaffCard = ({ staff, index, canManage, onEdit, onDelete, onToggleStatus }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(102,126,234,0.18)",
      borderRadius: "20px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      boxShadow: "0 4px 24px rgba(102,126,234,0.08)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      animation: `fadeSlideUp 0.4s ease ${index * 0.05}s both`,
      cursor: "default",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow =
        "0 8px 32px rgba(102,126,234,0.18)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 4px 24px rgba(102,126,234,0.08)";
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            background: staff.status === "inactive" 
              ? "linear-gradient(135deg, #d4d4d8 0%, #9ca3af 100%)" 
              : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "22px",
            flexShrink: 0,
            boxShadow: staff.status === "inactive" ? "none" : "0 4px 12px rgba(67,233,123,0.3)",
          }}
        >
          {getRoleIcon(staff.role)}
        </div>
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "17px",
              color: "#1f2937",
              lineHeight: 1.2
            }}
          >
            {staff.name}
          </div>
          <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {staff.role}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <StatusBadge status={staff.status} />
        {canManage && (
          <StaffActionsMenu
            staff={staff}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        )}
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" }}>
      <div style={{ background: "rgba(102,126,234,0.06)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(102,126,234,0.1)" }}>
        <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
          📧 Email Contact
        </div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
          {staff.email}
        </div>
      </div>
      <div style={{ background: "rgba(102,126,234,0.06)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(102,126,234,0.1)" }}>
        <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
          🎓 Specialization
        </div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
          {staff.specialization || "General"}
        </div>
      </div>
    </div>
  </div>
);

// ─── Create Dialog ────────────────────────────────────────────────────────────

const CreateStaffDialog = ({ open, onClose, onCreate, loading, error }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    specialization: "",
  });

  useEffect(() => {
    if (open) setForm({ name: "", email: "", password: "", role: "", specialization: "" });
  }, [open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const isValid = form.name.trim() && form.email.trim() && form.password.trim() && form.role;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          color: "#064e3b",
          fontWeight: 800,
          fontSize: "18px",
          borderRadius: "20px 20px 0 0",
          py: 2.5,
          px: 3,
        }}
      >
        <GroupIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Onboard New Staff
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            fullWidth
            required
            value={form.name}
            onChange={set("name")}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={form.email}
            onChange={set("email")}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={form.password}
            onChange={set("password")}
            helperText="Staff can change this later"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <FormControl fullWidth required sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
            <InputLabel>Role</InputLabel>
            <Select value={form.role} label="Role" onChange={set("role")}>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="nurse">Nurse</MenuItem>
              <MenuItem value="pharmacist">Pharmacist</MenuItem>
              <MenuItem value="receptionist">Receptionist</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Specialization (Optional)"
            fullWidth
            value={form.specialization}
            onChange={set("specialization")}
            placeholder="e.g. Cardiology, Pediatrics"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "12px", px: 3 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!isValid) return;
            onCreate(form);
          }}
          disabled={!isValid || loading}
          sx={{
            borderRadius: "12px",
            px: 3,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontWeight: 700,
            "&:hover": { background: "linear-gradient(135deg, #059669 0%, #047857 100%)" },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Onboard Staff"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Edit Dialog ─────────────────────────────────────────────────────────────

const EditStaffDialog = ({ open, staff, onClose, onSave, loading, error }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    specialization: "",
  });

  useEffect(() => {
    if (open && staff) {
      setForm({
        name: staff.name || "",
        email: staff.email || "",
        role: staff.role || "",
        specialization: staff.specialization || "",
      });
    }
  }, [open, staff]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const isValid = form.name.trim() && form.email.trim() && form.role;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
          color: "#fff",
          fontWeight: 800,
          fontSize: "18px",
          borderRadius: "20px 20px 0 0",
          py: 2.5,
          px: 3,
        }}
      >
        <EditOutlinedIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Edit Staff — {staff?.name}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            fullWidth
            required
            value={form.name}
            onChange={set("name")}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={form.email}
            onChange={set("email")}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <FormControl fullWidth required sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
            <InputLabel>Role</InputLabel>
            <Select value={form.role} label="Role" onChange={set("role")}>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="nurse">Nurse</MenuItem>
              <MenuItem value="pharmacist">Pharmacist</MenuItem>
              <MenuItem value="receptionist">Receptionist</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Specialization (Optional)"
            fullWidth
            value={form.specialization}
            onChange={set("specialization")}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "12px", px: 3 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!isValid || !staff) return;
            onSave(staff.id, form);
          }}
          disabled={!isValid || loading}
          sx={{
            borderRadius: "12px",
            px: 3,
            background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = ({ canManage }) => (
  <div
    style={{
      gridColumn: "1 / -1",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      padding: "64px 24px",
      textAlign: "center",
      animation: "fadeSlideUp 0.5s ease",
    }}
  >
    <div
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "24px",
        background: "linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
        border: "2px solid rgba(102,126,234,0.2)",
      }}
    >
      <GroupIcon sx={{ fontSize: 40, color: "#667eea" }} />
    </div>
    <div>
      <div style={{ fontSize: "18px", fontWeight: 800, color: "#374151", marginBottom: "8px" }}>
        No staff members found
      </div>
      <div style={{ fontSize: "14px", color: "#9ca3af", maxWidth: "320px" }}>
        {canManage
          ? "Onboard new doctors, nurses, and staff members to manage your clinic seamlessly."
          : "Your clinic has no registered staff members yet."}
      </div>
    </div>
  </div>
);

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const StatsBar = ({ list }) => {
  const counts = list.reduce(
    (acc, s) => {
      acc[s.role] = (acc[s.role] || 0) + 1;
      return acc;
    },
    {}
  );
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      {[
        { key: "doctor", label: "Doctors", icon: <MedicationIcon />, color: "#48c6ef" },
        { key: "nurse", label: "Nurses", icon: <HealingIcon />, color: "#f5576c" },
        { key: "pharmacist", label: "Pharmacists", icon: <LocalHospitalIcon />, color: "#667eea" },
        { key: "receptionist", label: "Receptionists", icon: <ContactPhoneIcon />, color: "#fb923c" },
      ].map(({ key, label, icon, color }) => {
        if (!counts[key]) return null;
        return (
          <div
            key={key}
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${color}33`,
              borderRadius: "16px",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: `0 4px 16px ${color}18`,
              minWidth: "140px",
              flex: "1 1 auto",
            }}
          >
            <span style={{ fontSize: "22px", color: color, display: "flex", alignItems: "center" }}>{icon}</span>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 800, color, lineHeight: 1 }}>
                {counts[key] || 0}
              </div>
              <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>
                {label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const StaffPage = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const isAdmin = role === "admin";

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
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevLen = React.useRef(list.length);
  useEffect(() => {
    if (createOpen && !actionLoading && !actionError && list.length > prevLen.current) {
      setCreateOpen(false);
    }
    prevLen.current = list.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length, actionLoading, actionError]);

  useEffect(() => {
    if (editingStaff && !actionLoading && !actionError) {
      setEditingStaff(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionLoading]);

  // Non-admins shouldn't even be here physically, but just a fallback view:
  if (!["admin", "doctor", "nurse", "pharmacist", "receptionist"].includes(role)) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🚫</div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#374151" }}>Access Denied</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ animation: "fadeSlideUp 0.4s ease" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.2,
              }}
            >
              👥 Staff Directory
            </h1>
            <p style={{ margin: "6px 0 0", color: "#9ca3af", fontSize: "14px" }}>
              Manage doctors, nurses, pharmacists, and receptionists
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Tooltip title="Refresh">
              <span>
                <IconButton
                  onClick={fetchStaff}
                  disabled={loading}
                  sx={{
                    border: "1px solid rgba(102,126,234,0.2)",
                    borderRadius: "12px",
                    "&:hover": { background: "rgba(102,126,234,0.08)" },
                  }}
                >
                  <RefreshIcon sx={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                </IconButton>
              </span>
            </Tooltip>

            {isAdmin && (
              <button
                onClick={() => {
                  clearError();
                  setCreateOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(16,185,129,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.3)";
                }}
              >
                <AddIcon style={{ fontSize: "18px" }} />
                Add Staff
              </button>
            )}
          </div>
        </div>

        <RoleBanner role={role} />

        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 3, borderRadius: "14px" }}>
            {error}
          </Alert>
        )}

        {!loading && list.length > 0 && <StatsBar list={list} />}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "64px 0", gap: "16px", flexDirection: "column" }}>
            <CircularProgress size={40} sx={{ color: "#667eea" }} />
            <div style={{ color: "#9ca3af", fontSize: "14px" }}>Loading staff directory…</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "20px",
            }}
          >
            {list.length === 0 ? (
              <EmptyState canManage={isAdmin} />
            ) : (
              list.map((staff, i) => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  index={i}
                  canManage={isAdmin}
                  onEdit={(s) => {
                    clearError();
                    setEditingStaff(s);
                  }}
                  onDelete={(s) => deleteStaff(s.id)}
                  onToggleStatus={(s) => {
                    updateStaff(s.id, { status: s.status === "active" ? "inactive" : "active" })
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>

      <CreateStaffDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createStaff}
        loading={actionLoading}
        error={actionError}
      />
      
      <EditStaffDialog
        open={Boolean(editingStaff)}
        staff={editingStaff}
        onClose={() => setEditingStaff(null)}
        onSave={updateStaff}
        loading={actionLoading}
        error={actionError}
      />
    </>
  );
};

export default StaffPage;
