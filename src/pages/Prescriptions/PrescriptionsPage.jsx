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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import MedicationIcon from "@mui/icons-material/Medication";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";
import usePrescriptions from "../../modules/prescriptions/hooks/usePrescriptions";
import { useThemeMode } from "../../context/ThemeContext";
import HeroBanner from "../../components/common/HeroBanner";

// ─── Theme Tokens ─────────────────────────────────────────────────────────────
const getTokens = (mode) => ({
  isDark: mode === "dark",
  bg:           mode === "dark" ? "#0D1117" : "#F4F6FB",
  surface:      mode === "dark" ? "#161B22" : "#FFFFFF",
  surfaceAlt:   mode === "dark" ? "#1C2333" : "#F0F2F8",
  border:       mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  text:         mode === "dark" ? "#E6EDF3" : "#1A1A2E",
  textSecondary:mode === "dark" ? "#8B949E" : "#718096",
  // Brand palette — matches the purple/green dashboard screenshots
  purple:       "#7C3AED",
  purpleLight:  "rgba(124,58,237,0.12)",
  green:        "#16A34A",
  greenLight:   "rgba(22,163,74,0.12)",
  teal:         "#0891B2",
  tealLight:    "rgba(8,145,178,0.12)",
  orange:       "#EA580C",
  orangeLight:  "rgba(234,88,12,0.12)",
  cardShadow:   mode === "dark" ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.07)",
  cardHover:    mode === "dark" ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.12)",
});

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  created:   { label: "Created",   gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", dot: "#7C3AED" },
  verified:  { label: "Verified",  gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", dot: "#16A34A" },
  dispensed: { label: "Dispensed", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", dot: "#0891B2" },
};
const NEXT_STATUS = { created: "verified", verified: "dispensed" };

// ─── Role Banner ─────────────────────────────────────────────────────────────
const ROLE_INFO = {
  doctor:     { icon: <MedicationIcon />,    label: "Doctor View",     desc: "You can create, edit, and delete your own prescriptions.",   gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  pharmacist: { icon: <LocalPharmacyIcon />, label: "Pharmacist View", desc: "You can verify and mark prescriptions as dispensed.",         gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  patient:    { icon: <PersonIcon />,        label: "Patient View",    desc: "Showing your prescriptions only — read access.",              gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
};

const RoleBanner = ({ role }) => {
  const info = ROLE_INFO[role];
  if (!info) return null;
  return (
    <div style={{
      background: info.gradient,
      borderRadius: "16px",
      padding: "16px 22px",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      color: "#fff",
      boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
      animation: "slideDown 0.4s ease",
    }}>
      <span style={{ display: "flex", fontSize: "26px" }}>{info.icon}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: "15px" }}>{info.label}</div>
        <div style={{ fontSize: "13px", opacity: 0.9 }}>{info.desc}</div>
      </div>
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, gradient: "#ccc", dot: "#999" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "5px 12px",
      borderRadius: "20px",
      background: cfg.gradient,
      color: "#fff",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    }}>
      {status === "verified"  && <VerifiedIcon style={{ fontSize: "12px" }} />}
      {status === "dispensed" && <CheckCircleOutlineIcon style={{ fontSize: "12px" }} />}
      {cfg.label}
    </span>
  );
};

// ─── Actions Menu ─────────────────────────────────────────────────────────────
const RxActionsMenu = ({ rx, canEdit, canDelete, canAdvance, onEdit, onDelete, onAdvance }) => {
  const [anchor, setAnchor] = useState(null);
  const { mode } = useThemeMode();
  const t = getTokens(mode);
  const nextStatus = NEXT_STATUS[rx.status];
  const hasActions = (canEdit && rx.status === "created") || canDelete || (canAdvance && nextStatus);
  if (!hasActions) return null;
  return (
    <>
      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget); }}
        sx={{ color: t.textSecondary, "&:hover": { background: t.purpleLight } }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", border: `1px solid ${t.border}`, minWidth: 190, bgcolor: t.surface } }}>
        {canAdvance && nextStatus && (
          <MenuItem onClick={() => { onAdvance(rx, nextStatus); setAnchor(null); }}
            sx={{ gap: 1.5, color: nextStatus === "verified" ? t.purple : t.teal, fontWeight: 700, fontSize: "14px" }}>
            {nextStatus === "verified" ? <VerifiedIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
            Mark as {STATUS_CONFIG[nextStatus]?.label || nextStatus}
          </MenuItem>
        )}
        {canEdit && rx.status === "created" && (
          <MenuItem onClick={() => { onEdit(rx); setAnchor(null); }}
            sx={{ gap: 1.5, color: "#2563eb", fontWeight: 500, fontSize: "14px" }}>
            <EditOutlinedIcon fontSize="small" /> Edit Prescription
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem onClick={() => { onDelete(rx); setAnchor(null); }}
            sx={{ gap: 1.5, color: "#dc2626", fontWeight: 500, fontSize: "14px" }}>
            <DeleteOutlineIcon fontSize="small" /> Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// ─── Prescription Card ─────────────────────────────────────────────────────────
const RxCard = ({ rx, index, canEdit, canDelete, canAdvance, onEdit, onDelete, onAdvance }) => {
  const { mode } = useThemeMode();
  const t = getTokens(mode);
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxShadow: t.cardShadow,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        animation: `fadeSlideUp 0.4s ease ${index * 0.05}s both`,
        cursor: "default",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = t.cardHover; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = t.cardShadow; }}
    >
      {/* Card top accent */}
      <div style={{ height: "4px", borderRadius: "4px 4px 0 0", background: STATUS_CONFIG[rx.status]?.gradient || "#ccc", margin: "-20px -20px 0 -20px", borderRadius: "20px 20px 0 0" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "14px",
            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "20px", flexShrink: 0,
            boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
          }}>
            <MedicationIcon fontSize="inherit" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "16px", color: t.text }}>Rx #{rx.id}</div>
            <div style={{ fontSize: "11px", color: t.textSecondary, marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
              <CalendarTodayIcon style={{ fontSize: "10px" }} />
              {rx.created_at ? new Date(rx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <StatusBadge status={rx.status} />
          <RxActionsMenu rx={rx} canEdit={canEdit} canDelete={canDelete} canAdvance={canAdvance} onEdit={onEdit} onDelete={onDelete} onAdvance={onAdvance} />
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[{ label: "Doctor", value: rx.doctor_name || `#${rx.doctor_id}`, icon: "🩺" }, { label: "Patient ID", value: `#${rx.patient_id}`, icon: "👤" }]
          .map(({ label, value, icon }) => (
            <div key={label} style={{ background: t.surfaceAlt, borderRadius: "12px", padding: "10px 12px", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: "10px", color: t.textSecondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{icon} {label}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: t.text, marginTop: "3px" }}>{value}</div>
            </div>
          ))}
      </div>

      {/* Medicines */}
      <div>
        <div style={{ fontSize: "11px", fontWeight: 700, color: t.isDark ? "#A78BFA" : "#7C3AED", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
          💊 Medicines &amp; Instructions
        </div>
        <div style={{
          background: t.isDark ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.05)",
          borderRadius: "12px", padding: "12px 14px",
          fontSize: "13px", color: t.text, whiteSpace: "pre-wrap", wordBreak: "break-word",
          maxHeight: "110px", overflowY: "auto", lineHeight: "1.7",
          border: `1px solid ${t.isDark ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.12)"}`,
        }}>
          {rx.medicines}
        </div>
      </div>
    </div>
  );
};

// ─── Create Dialog ─────────────────────────────────────────────────────────────
const CreateDialog = ({ open, onClose, onCreate, loading, error }) => {
  const { mode } = useThemeMode();
  const t = getTokens(mode);
  const [form, setForm] = useState({ patient_id: "", appointment_id: "", medicines: "" });
  useEffect(() => { if (open) setForm({ patient_id: "", appointment_id: "", medicines: "" }); }, [open]);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const isValid = form.patient_id && form.appointment_id && form.medicines.trim();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "20px", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", bgcolor: t.surface } }}>
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
        color: "#fff", fontWeight: 800, fontSize: "18px",
        borderRadius: "20px 20px 0 0", py: 2.5, px: 3,
      }}>
        <MedicationIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        New Prescription
      </DialogTitle>
      <DialogContent sx={{ pt: 3, bgcolor: t.surface }}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>{error}</Alert>}
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField label="Patient ID" type="number" fullWidth required value={form.patient_id} onChange={set("patient_id")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Appointment ID" type="number" fullWidth required value={form.appointment_id} onChange={set("appointment_id")} helperText="The appointment this prescription was written for" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Medicines & Instructions" fullWidth required multiline minRows={4} value={form.medicines} onChange={set("medicines")} placeholder={"e.g. Amoxicillin 500mg — 1 tablet 3×/day for 5 days\nParacetamol 650mg — as needed"} helperText="List each medicine, dosage, and instructions" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, bgcolor: t.surface }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "12px", px: 3, color: t.textSecondary }}>Cancel</Button>
        <Button variant="contained" onClick={() => { if (!isValid) return; onCreate({ patient_id: Number(form.patient_id), appointment_id: Number(form.appointment_id), medicines: form.medicines.trim() }); }}
          disabled={!isValid || loading}
          sx={{ borderRadius: "12px", px: 3, background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)", fontWeight: 700, "&:hover": { background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)" } }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Create Prescription"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Edit Dialog ─────────────────────────────────────────────────────────────
const EditDialog = ({ open, rx, onClose, onSave, loading, error }) => {
  const { mode } = useThemeMode();
  const t = getTokens(mode);
  const [medicines, setMedicines] = useState("");
  useEffect(() => { if (open && rx) setMedicines(rx.medicines || ""); }, [open, rx]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "20px", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", bgcolor: t.surface } }}>
      <DialogTitle sx={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)", color: "#fff", fontWeight: 800, fontSize: "18px", borderRadius: "20px 20px 0 0", py: 2.5, px: 3 }}>
        <EditOutlinedIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Edit Prescription {rx ? `#${rx.id}` : ""}
      </DialogTitle>
      <DialogContent sx={{ pt: 3, bgcolor: t.surface }}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>{error}</Alert>}
        <TextField label="Medicines & Instructions" fullWidth required multiline minRows={5} value={medicines} onChange={(e) => setMedicines(e.target.value)} helperText="Update medicines, dosage, and instructions" sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, bgcolor: t.surface }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "12px", px: 3, color: t.textSecondary }}>Cancel</Button>
        <Button variant="contained" onClick={() => { if (!medicines.trim() || !rx) return; onSave(rx.id, { medicines: medicines.trim() }); }}
          disabled={!medicines.trim() || loading}
          sx={{ borderRadius: "12px", px: 3, background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)", fontWeight: 700 }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Stats Row ────────────────────────────────────────────────────────────────
const StatsRow = ({ list, mode }) => {
  const t = getTokens(mode);
  const counts = list.reduce((acc, rx) => { acc[rx.status] = (acc[rx.status] || 0) + 1; return acc; }, {});
  const stats = [
    { key: "created",   label: "Created",   emoji: "🆕", color: t.purple,  bgColor: t.purpleLight },
    { key: "verified",  label: "Verified",  emoji: "✅", color: t.green,   bgColor: t.greenLight  },
    { key: "dispensed", label: "Dispensed", emoji: "📦", color: t.teal,    bgColor: t.tealLight   },
    { key: "_total",    label: "Total",     emoji: "📋", color: t.text,    bgColor: t.surfaceAlt  },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px", marginBottom: "24px" }}>
      {stats.map(({ key, label, emoji, color, bgColor }) => (
        <div key={key} style={{
          background: bgColor, borderRadius: "16px", padding: "16px 18px",
          border: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: "12px",
          boxShadow: t.cardShadow, transition: "transform 0.2s",
        }}>
          <span style={{ fontSize: "24px" }}>{emoji}</span>
          <div>
            <div style={{ fontSize: "26px", fontWeight: 900, color, lineHeight: 1 }}>
              {key === "_total" ? list.length : (counts[key] || 0)}
            </div>
            <div style={{ fontSize: "11px", color: t.textSecondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PrescriptionsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useThemeMode();
  const t = getTokens(mode);
  const role = user?.role;

  const { list, loading, error, actionLoading, actionError, fetchPrescriptions, createPrescription, updatePrescription, updatePrescriptionStatus, deletePrescription, clearError } = usePrescriptions();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRx, setEditingRx] = useState(null);

  const canCreate = role === "doctor";
  const canEdit   = role === "doctor";
  const canDelete = role === "doctor";
  const canAdvance = role === "pharmacist";
  const isAllowedRole = ["doctor", "pharmacist", "patient"].includes(role);

  useEffect(() => { if (isAllowedRole) fetchPrescriptions(); }, []); // eslint-disable-line

  const prevLen = React.useRef(list.length);
  useEffect(() => {
    if (createOpen && !actionLoading && !actionError && list.length > prevLen.current) setCreateOpen(false);
    prevLen.current = list.length;
  }, [list.length, actionLoading, actionError]); // eslint-disable-line

  useEffect(() => { if (editingRx && !actionLoading && !actionError) setEditingRx(null); }, [actionLoading]); // eslint-disable-line

  if (!isAllowedRole) {
    return (
      <div style={{ padding: "60px", textAlign: "center", background: t.bg, borderRadius: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚫</div>
        <div style={{ fontSize: "20px", fontWeight: 800, color: t.text }}>Access Denied</div>
        <div style={{ color: t.textSecondary, marginTop: "8px", fontSize: "14px" }}>
          Prescriptions are only accessible to doctors, pharmacists, and patients.
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      `}</style>

      <div style={{ animation: "fadeSlideUp 0.4s ease" }}>
        {/* Hero Banner */}
        <HeroBanner
          title={role === "doctor" ? "Prescriptions — Doctor View" : role === "pharmacist" ? "Prescriptions — Pharmacist View" : "Your Prescriptions"}
          subtitle="Created by doctors · Verified & dispensed by pharmacy · Scoped to your tenant"
          icon="💊"
          gradient="linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4F46E5 100%)"
          pills={[
            { icon: "🔴", label: "Live Data" },
            { icon: "🏥", label: "Tenant-wide" },
            { icon: "📋", label: "Role-scoped View" },
          ]}
        />

        {/* Action buttons row */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Tooltip title="Refresh">
              <span>
                <IconButton onClick={fetchPrescriptions} disabled={loading}
                  sx={{ border: `1px solid ${t.border}`, borderRadius: "12px", color: t.textSecondary, "&:hover": { background: t.purpleLight } }}>
                  <RefreshIcon sx={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                </IconButton>
              </span>
            </Tooltip>
            {canCreate && (
              <button
                onClick={() => { clearError(); setCreateOpen(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                  color: "#fff", border: "none", borderRadius: "14px",
                  fontWeight: 700, fontSize: "14px", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; }}
              >
                <AddIcon style={{ fontSize: "18px" }} /> New Prescription
              </button>
            )}
          </div>
        </div>

        {/* Role Banner */}
        <RoleBanner role={role} />

        {/* Error */}
        {error && <Alert severity="error" onClose={clearError} sx={{ mb: 3, borderRadius: "14px" }}>{error}</Alert>}

        {/* Stats */}
        {!loading && list.length > 0 && <StatsRow list={list} mode={mode} />}

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0", gap: "16px", flexDirection: "column" }}>
            <CircularProgress size={44} sx={{ color: "#7C3AED" }} />
            <div style={{ color: t.textSecondary, fontSize: "14px" }}>Loading prescriptions…</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "20px" }}>
            {list.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "80px 24px", textAlign: "center", animation: "fadeSlideUp 0.5s ease" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: t.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", border: `2px solid ${t.border}` }}>💊</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: t.text }}>No prescriptions found</div>
                <div style={{ fontSize: "14px", color: t.textSecondary, maxWidth: "320px" }}>
                  {canCreate ? "Start by creating a new prescription for a patient." : role === "pharmacist" ? "No prescriptions available for verification yet." : "Your prescriptions will appear here once a doctor creates one."}
                </div>
              </div>
            ) : (
              list.map((rx, i) => (
                <RxCard key={rx.id} rx={rx} index={i} canEdit={canEdit} canDelete={canDelete} canAdvance={canAdvance}
                  onEdit={(rx) => { clearError(); setEditingRx(rx); }}
                  onDelete={(rx) => deletePrescription(rx.id)}
                  onAdvance={(rx, next) => updatePrescriptionStatus(rx.id, next)}
                />
              ))
            )}
          </div>
        )}
      </div>

      <CreateDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createPrescription} loading={actionLoading} error={actionError} />
      <EditDialog open={Boolean(editingRx)} rx={editingRx} onClose={() => setEditingRx(null)} onSave={updatePrescription} loading={actionLoading} error={actionError} />
    </>
  );
};

export default PrescriptionsPage;
