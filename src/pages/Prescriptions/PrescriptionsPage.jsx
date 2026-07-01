import React, { useEffect, useState, useCallback } from "react";
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
  Chip,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import MedicationIcon from "@mui/icons-material/Medication";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";
import usePrescriptions from "../../modules/prescriptions/hooks/usePrescriptions";

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  created: {
    label: "Created",
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "rgba(102,126,234,0.4)",
  },
  verified: {
    label: "Verified",
    bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "#fff",
    border: "rgba(240,147,251,0.4)",
  },
  dispensed: {
    label: "Dispensed",
    bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    color: "#fff",
    border: "rgba(79,172,254,0.4)",
  },
};

// pharmacist can advance: created → verified → dispensed
const NEXT_STATUS = { created: "verified", verified: "dispensed" };

// ─── Role Banner ─────────────────────────────────────────────────────────────

const ROLE_INFO = {
  doctor: {
    icon: <MedicationIcon />,
    label: "Doctor View",
    desc: "You can create, edit, and delete your own prescriptions.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  pharmacist: {
    icon: <LocalPharmacyIcon />,
    label: "Pharmacist View",
    desc: "You can verify and mark prescriptions as dispensed.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  patient: {
    icon: <PersonIcon />,
    label: "Patient View",
    desc: "Showing your prescriptions only.",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
};

const RoleBanner = ({ role }) => {
  const info = ROLE_INFO[role];
  if (!info) return null;
  return (
    <div
      style={{
        background: info.gradient,
        borderRadius: "16px",
        padding: "14px 20px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        animation: "slideDown 0.4s ease",
      }}
    >
      <span style={{ display: "flex", fontSize: "22px" }}>{info.icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>{info.label}</div>
        <div style={{ fontSize: "13px", opacity: 0.9 }}>{info.desc}</div>
      </div>
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {
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
      {status === "verified" && <VerifiedIcon style={{ fontSize: "12px" }} />}
      {status === "dispensed" && (
        <CheckCircleOutlineIcon style={{ fontSize: "12px" }} />
      )}
      {cfg.label}
    </span>
  );
};

// ─── Actions Menu ────────────────────────────────────────────────────────────

const RxActionsMenu = ({
  rx,
  canEdit,
  canDelete,
  canAdvance,
  onEdit,
  onDelete,
  onAdvance,
}) => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const nextStatus = NEXT_STATUS[rx.status];
  const hasActions =
    (canEdit && rx.status === "created") ||
    canDelete ||
    (canAdvance && nextStatus);

  if (!hasActions) return null;

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
        {/* Pharmacist: advance status */}
        {canAdvance && nextStatus && (
          <MenuItem
            onClick={() => {
              onAdvance(rx, nextStatus);
              setAnchor(null);
            }}
            sx={{
              gap: 1,
              color:
                nextStatus === "verified" ? "#7c3aed" : "#0369a1",
              fontWeight: 600,
            }}
          >
            {nextStatus === "verified" ? (
              <VerifiedIcon fontSize="small" />
            ) : (
              <CheckCircleOutlineIcon fontSize="small" />
            )}
            Mark as {STATUS_CONFIG[nextStatus]?.label || nextStatus}
          </MenuItem>
        )}
        {/* Doctor: edit (only if status is created) */}
        {canEdit && rx.status === "created" && (
          <MenuItem
            onClick={() => {
              onEdit(rx);
              setAnchor(null);
            }}
            sx={{ gap: 1, color: "#1d4ed8", fontWeight: 500 }}
          >
            <EditOutlinedIcon fontSize="small" />
            Edit Prescription
          </MenuItem>
        )}
        {/* Doctor: delete */}
        {canDelete && (
          <MenuItem
            onClick={() => {
              onDelete(rx);
              setAnchor(null);
            }}
            sx={{ gap: 1, color: "#dc2626", fontWeight: 500 }}
          >
            <DeleteOutlineIcon fontSize="small" />
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// ─── Prescription Card ───────────────────────────────────────────────────────

const RxCard = ({
  rx,
  index,
  canEdit,
  canDelete,
  canAdvance,
  onEdit,
  onDelete,
  onAdvance,
}) => (
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
    {/* Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "18px",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
          }}
        >
          <MedicationIcon fontSize="inherit" />
        </div>
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Rx #{rx.id}
          </div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "1px" }}>
            <CalendarTodayIcon
              style={{ fontSize: "10px", marginRight: "3px" }}
            />
            {rx.created_at
              ? new Date(rx.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <StatusBadge status={rx.status} />
        <RxActionsMenu
          rx={rx}
          canEdit={canEdit}
          canDelete={canDelete}
          canAdvance={canAdvance}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdvance={onAdvance}
        />
      </div>
    </div>

    {/* Meta info */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
      }}
    >
      {[
        {
          label: "Doctor",
          value: rx.doctor_name || `#${rx.doctor_id}`,
          icon: "🩺",
        },
        {
          label: "Patient ID",
          value: `#${rx.patient_id}`,
          icon: "👤",
        },
      ].map(({ label, value, icon }) => (
        <div
          key={label}
          style={{
            background: "rgba(102,126,234,0.06)",
            borderRadius: "10px",
            padding: "8px 12px",
            border: "1px solid rgba(102,126,234,0.1)",
          }}
        >
          <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {icon} {label}
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#374151", marginTop: "2px" }}>
            {value}
          </div>
        </div>
      ))}
    </div>

    {/* Medicines */}
    <div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#6366f1",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: "6px",
        }}
      >
        💊 Medicines & Instructions
      </div>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(102,126,234,0.06) 0%, rgba(118,75,162,0.06) 100%)",
          borderRadius: "12px",
          padding: "12px 14px",
          fontSize: "13px",
          color: "#374151",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: "110px",
          overflowY: "auto",
          lineHeight: "1.6",
          border: "1px solid rgba(102,126,234,0.12)",
        }}
      >
        {rx.medicines}
      </div>
    </div>
  </div>
);

// ─── Create Dialog ────────────────────────────────────────────────────────────

const CreateDialog = ({ open, onClose, onCreate, loading, error }) => {
  const [form, setForm] = useState({
    patient_id: "",
    appointment_id: "",
    medicines: "",
  });

  useEffect(() => {
    if (open) setForm({ patient_id: "", appointment_id: "", medicines: "" });
  }, [open]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const isValid =
    form.patient_id && form.appointment_id && form.medicines.trim();

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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          fontWeight: 800,
          fontSize: "18px",
          borderRadius: "20px 20px 0 0",
          py: 2.5,
          px: 3,
        }}
      >
        <MedicationIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        New Prescription
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Patient ID"
            type="number"
            fullWidth
            required
            value={form.patient_id}
            onChange={set("patient_id")}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <TextField
            label="Appointment ID"
            type="number"
            fullWidth
            required
            value={form.appointment_id}
            onChange={set("appointment_id")}
            helperText="The appointment this prescription was written for"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <TextField
            label="Medicines & Instructions"
            fullWidth
            required
            multiline
            minRows={4}
            value={form.medicines}
            onChange={set("medicines")}
            placeholder={
              "e.g. Amoxicillin 500mg — 1 tablet 3×/day for 5 days\nParacetamol 650mg — as needed"
            }
            helperText="List each medicine, dosage, and instructions"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: "12px", px: 3 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!isValid) return;
            onCreate({
              patient_id: Number(form.patient_id),
              appointment_id: Number(form.appointment_id),
              medicines: form.medicines.trim(),
            });
          }}
          disabled={!isValid || loading}
          sx={{
            borderRadius: "12px",
            px: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontWeight: 700,
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b21a8 100%)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create Prescription"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Edit Dialog ─────────────────────────────────────────────────────────────

const EditDialog = ({ open, rx, onClose, onSave, loading, error }) => {
  const [medicines, setMedicines] = useState("");

  useEffect(() => {
    if (open && rx) setMedicines(rx.medicines || "");
  }, [open, rx]);

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
        Edit Prescription {rx ? `#${rx.id}` : ""}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Medicines & Instructions"
          fullWidth
          required
          multiline
          minRows={5}
          value={medicines}
          onChange={(e) => setMedicines(e.target.value)}
          helperText="Update medicines, dosage, and instructions"
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: "12px", px: 3 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!medicines.trim() || !rx) return;
            onSave(rx.id, { medicines: medicines.trim() });
          }}
          disabled={!medicines.trim() || loading}
          sx={{
            borderRadius: "12px",
            px: 3,
            background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
            fontWeight: 700,
          }}
        >
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

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = ({ canCreate, role }) => (
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
      💊
    </div>
    <div>
      <div style={{ fontSize: "18px", fontWeight: 800, color: "#374151", marginBottom: "8px" }}>
        No prescriptions found
      </div>
      <div style={{ fontSize: "14px", color: "#9ca3af", maxWidth: "320px" }}>
        {canCreate
          ? "Start by creating a new prescription for a patient."
          : role === "pharmacist"
          ? "No prescriptions available for verification yet."
          : "Your prescriptions will appear here once a doctor creates one."}
      </div>
    </div>
  </div>
);

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const StatsBar = ({ list }) => {
  const counts = list.reduce(
    (acc, rx) => {
      acc[rx.status] = (acc[rx.status] || 0) + 1;
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
        { key: "created", label: "Created", emoji: "🆕", color: "#667eea" },
        { key: "verified", label: "Verified", emoji: "✅", color: "#f5576c" },
        { key: "dispensed", label: "Dispensed", emoji: "📦", color: "#4facfe" },
      ].map(({ key, label, emoji, color }) => (
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
            minWidth: "120px",
            flex: "1 1 100px",
          }}
        >
          <span style={{ fontSize: "22px" }}>{emoji}</span>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 800, color, lineHeight: 1 }}>
              {counts[key] || 0}
            </div>
            <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {label}
            </div>
          </div>
        </div>
      ))}
      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(102,126,234,0.2)",
          borderRadius: "16px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 4px 16px rgba(102,126,234,0.1)",
          minWidth: "120px",
          flex: "1 1 100px",
        }}
      >
        <span style={{ fontSize: "22px" }}>📋</span>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#374151", lineHeight: 1 }}>
            {list.length}
          </div>
          <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Total
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const PrescriptionsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const {
    list,
    loading,
    error,
    actionLoading,
    actionError,
    fetchPrescriptions,
    createPrescription,
    updatePrescription,
    updatePrescriptionStatus,
    deletePrescription,
    clearError,
  } = usePrescriptions();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingRx, setEditingRx] = useState(null);

  // Role gates
  // doctor: can create, edit (their own, status=created), delete (their own)
  // pharmacist: can advance status only (verified, dispensed) — no create/edit/delete
  // patient: read-only (backend scopes to their own)
  const canCreate = role === "doctor";
  const canEdit = role === "doctor";
  const canDelete = role === "doctor";
  const canAdvance = role === "pharmacist"; // only pharmacist advances status

  // Allowed roles guard
  const isAllowedRole = ["doctor", "pharmacist", "patient"].includes(role);

  useEffect(() => {
    if (isAllowedRole) fetchPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-close create dialog on success
  const prevLen = React.useRef(list.length);
  useEffect(() => {
    if (
      createOpen &&
      !actionLoading &&
      !actionError &&
      list.length > prevLen.current
    ) {
      setCreateOpen(false);
    }
    prevLen.current = list.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length, actionLoading, actionError]);

  // Auto-close edit dialog on success
  useEffect(() => {
    if (editingRx && !actionLoading && !actionError) {
      setEditingRx(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionLoading]);

  if (!isAllowedRole) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🚫</div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#374151" }}>
          Access Denied
        </div>
        <div style={{ color: "#9ca3af", marginTop: "8px" }}>
          Prescriptions are only accessible to doctors, pharmacists, and patients.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Global keyframe styles */}
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
        {/* Page Header */}
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.2,
              }}
            >
              💊 Prescriptions
            </h1>
            <p style={{ margin: "6px 0 0", color: "#9ca3af", fontSize: "14px" }}>
              Created by doctors · Verified &amp; dispensed by pharmacy
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Tooltip title="Refresh">
              <span>
                <IconButton
                  onClick={fetchPrescriptions}
                  disabled={loading}
                  sx={{
                    border: "1px solid rgba(102,126,234,0.2)",
                    borderRadius: "12px",
                    "&:hover": { background: "rgba(102,126,234,0.08)" },
                  }}
                >
                  <RefreshIcon
                    sx={{
                      animation: loading ? "spin 1s linear infinite" : "none",
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>

            {canCreate && (
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
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(102,126,234,0.4)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(102,126,234,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(102,126,234,0.4)";
                }}
              >
                <AddIcon style={{ fontSize: "18px" }} />
                New Prescription
              </button>
            )}
          </div>
        </div>

        {/* Role Banner */}
        <RoleBanner role={role} />

        {/* Error alert */}
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{ mb: 3, borderRadius: "14px" }}
          >
            {error}
          </Alert>
        )}

        {/* Stats */}
        {!loading && list.length > 0 && <StatsBar list={list} />}

        {/* Content */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "64px 0",
              gap: "16px",
              flexDirection: "column",
            }}
          >
            <CircularProgress
              size={40}
              sx={{ color: "#667eea" }}
            />
            <div style={{ color: "#9ca3af", fontSize: "14px" }}>
              Loading prescriptions…
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "20px",
            }}
          >
            {list.length === 0 ? (
              <EmptyState canCreate={canCreate} role={role} />
            ) : (
              list.map((rx, i) => (
                <RxCard
                  key={rx.id}
                  rx={rx}
                  index={i}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  canAdvance={canAdvance}
                  onEdit={(rx) => {
                    clearError();
                    setEditingRx(rx);
                  }}
                  onDelete={(rx) => deletePrescription(rx.id)}
                  onAdvance={(rx, next) =>
                    updatePrescriptionStatus(rx.id, next)
                  }
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createPrescription}
        loading={actionLoading}
        error={actionError}
      />
      <EditDialog
        open={Boolean(editingRx)}
        rx={editingRx}
        onClose={() => setEditingRx(null)}
        onSave={updatePrescription}
        loading={actionLoading}
        error={actionError}
      />
    </>
  );
};

export default PrescriptionsPage;
