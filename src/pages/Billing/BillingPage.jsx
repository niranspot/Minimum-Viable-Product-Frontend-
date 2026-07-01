import React, { useEffect, useState, useMemo } from "react";
import {
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, Stack, Tooltip, IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useSelector } from "react-redux";
import useBilling from "../../modules/billing/hooks/useBilling";
import { getSubdomain } from "../../utils/tenantUtils";
import { useThemeMode } from "../../context/ThemeContext";
import HeroBanner from "../../components/common/HeroBanner";

// ─── Theme Tokens ──────────────────────────────────────────────────────────────
const getTokens = (mode) => ({
  isDark:      mode === "dark",
  bg:          mode === "dark" ? "#0D1117" : "#F4F6FB",
  surface:     mode === "dark" ? "#161B22" : "#FFFFFF",
  surfaceAlt:  mode === "dark" ? "#1C2333" : "#F0F2F8",
  border:      mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  text:        mode === "dark" ? "#E6EDF3" : "#1A1A2E",
  textSec:     mode === "dark" ? "#8B949E" : "#718096",
  green:       "#16A34A",
  greenLight:  mode === "dark" ? "rgba(22,163,74,0.18)" : "rgba(22,163,74,0.12)",
  amber:       "#D97706",
  amberLight:  mode === "dark" ? "rgba(217,119,6,0.18)"  : "rgba(217,119,6,0.10)",
  blue:        "#2563EB",
  blueLight:   mode === "dark" ? "rgba(37,99,235,0.18)"  : "rgba(37,99,235,0.10)",
  purple:      "#7C3AED",
  purpleLight: mode === "dark" ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.10)",
  card:        mode === "dark" ? "0 4px 20px rgba(0,0,0,0.4)"  : "0 4px 16px rgba(0,0,0,0.07)",
  cardHover:   mode === "dark" ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 32px rgba(0,0,0,0.12)",
});

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status, mode }) => {
  const t = getTokens(mode);
  const isPaid = status === "paid";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "5px 12px", borderRadius: "30px", fontSize: "12px", fontWeight: 700,
      textTransform: "uppercase",
      background: isPaid ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" : "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
      color: "#fff",
      boxShadow: isPaid ? "0 2px 10px rgba(17,153,142,0.35)" : "0 2px 10px rgba(234,179,8,0.35)",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.8)" }} />
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
};

// ─── Create Invoice Dialog ─────────────────────────────────────────────────────
const CreateInvoiceDialog = ({ open, onClose, onCreate, loading, error, mode }) => {
  const t = getTokens(mode);
  const [form, setForm] = useState({ patient_id: "", appointment_id: "", amount: "" });
  useEffect(() => { if (open) setForm({ patient_id: "", appointment_id: "", amount: "" }); }, [open]);
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleSubmit = () => {
    if (!form.patient_id || !form.appointment_id || !form.amount) return;
    onCreate({ patient_id: Number(form.patient_id), appointment_id: Number(form.appointment_id), amount: Number(form.amount) });
  };
  const isValid = form.patient_id && form.appointment_id && form.amount;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "20px", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", bgcolor: t.surface } }}>
      <DialogTitle sx={{ background: "linear-gradient(135deg, #16A34A 0%, #0891B2 100%)", color: "#fff", fontWeight: 800, fontSize: "18px", borderRadius: "20px 20px 0 0", py: 2.5, px: 3 }}>
        🧾 Generate New Invoice
      </DialogTitle>
      <DialogContent sx={{ pt: 3, bgcolor: t.surface }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert>}
        <Stack spacing={2.5} sx={{ mt: 1.5 }}>
          {[
            { label: "Patient ID", field: "patient_id", type: "number", helper: "The profile ID of the patient record to invoice" },
            { label: "Appointment ID", field: "appointment_id", type: "number", helper: "The unique appointment linked for audit billing" },
            { label: "Amount (₹)", field: "amount", type: "number", helper: "" },
          ].map(({ label, field, type, helper }) => (
            <TextField key={field} label={label} type={type} fullWidth required value={form[field]} onChange={handleChange(field)} helperText={helper}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, bgcolor: t.surface }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "12px", color: t.textSec }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid || loading}
          sx={{ borderRadius: "12px", fontWeight: 700, background: "linear-gradient(135deg, #16A34A 0%, #0891B2 100%)", "&:hover": { background: "linear-gradient(135deg, #15803D 0%, #0369A1 100%)" } }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Publish Invoice"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, bgColor, border, shadow, emoji }) => (
  <div style={{
    background: bgColor, borderRadius: "18px", padding: "18px 22px",
    border: `1px solid ${border}`, boxShadow: shadow,
    transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
  }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.14)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = shadow; }}
  >
    <div style={{ fontSize: "24px", marginBottom: "8px" }}>{emoji}</div>
    <div style={{ fontSize: "26px", fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: "11px", color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>{label}</div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const BillingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useThemeMode();
  const t = getTokens(mode);
  const { list, loading, error, actionLoading, actionError, fetchBilling, createBilling, updateBillingStatus, clearError } = useBilling();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const activeSubdomain = getSubdomain() || "medicloud";

  useEffect(() => { fetchBilling(); }, []); // eslint-disable-line

  const canCreate  = ["doctor", "nurse"].includes(user?.role);
  const canMarkPaid = user?.role === "admin";

  const handleCreate = (data) => createBilling(data);

  const prevListLength = React.useRef(list.length);
  useEffect(() => {
    if (dialogOpen && !actionLoading && !actionError && list.length > prevListLength.current) setDialogOpen(false);
    prevListLength.current = list.length;
  }, [list.length, actionLoading, actionError]); // eslint-disable-line

  const handleTogglePaid = (bill) => {
    const id = bill.billing_id ?? bill.id;
    updateBillingStatus(id, bill.status === "paid" ? "pending" : "paid");
  };

  const stats = useMemo(() => {
    let totalAmt = 0, paidAmt = 0, pendingAmt = 0;
    list.forEach((b) => { const a = Number(b.amount || 0); totalAmt += a; if (b.status === "paid") paidAmt += a; else pendingAmt += a; });
    return { total: totalAmt, paid: paidAmt, pending: pendingAmt, rate: totalAmt > 0 ? ((paidAmt / totalAmt) * 100).toFixed(1) : "0.0" };
  }, [list]);

  const filteredList = useMemo(() => filter === "all" ? list : list.filter((b) => b.status === filter), [list, filter]);

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeRow { from { opacity:0; } to { opacity:1; } }
        .bill-row-hover:hover { background: ${t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)"} !important; }
      `}</style>

      <div style={{ animation: "slideUp 0.4s ease" }}>
        {/* ── Hero Banner ────────────────────────────────────────── */}
        <HeroBanner
          title="Finance & Invoices"
          subtitle={`Tenant-isolated billing records for ${activeSubdomain.toUpperCase()} · Admins can mark payments · Doctors generate invoices`}
          icon="💳"
          gradient="linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4F46E5 100%)"
          pills={[
            { icon: "🔴", label: "Live Data" },
            { icon: "🔒", label: "Tenant-isolated" },
            { icon: "📊", label: "Payment Tracking" },
          ]}
        />

        {/* ── Action buttons ─────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center", marginBottom: 16 }}>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={fetchBilling} disabled={loading} sx={{ color: t.textSec, border: `1px solid ${t.border}`, borderRadius: "12px" }}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          {canCreate && (
            <button onClick={() => { clearError(); setDialogOpen(true); }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)", color: "#fff", border: "none", borderRadius: "14px", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.4)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; }}>
              <AddIcon style={{ fontSize: "18px" }} /> Generate Invoice
            </button>
          )}
        </div>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "14px" }}>{error}</Alert>}

        {/* ── Stats ───────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "16px", marginBottom: "24px" }}>
          <StatCard emoji="🧾" label="Total Invoiced"     value={fmt(stats.total)}   color={t.text}   bgColor={t.surfaceAlt}  border={t.border}       shadow={t.card} />
          <StatCard emoji="✅" label="Total Received"     value={fmt(stats.paid)}    color={t.green}  bgColor={t.greenLight}  border="rgba(22,163,74,0.2)"  shadow={t.card} />
          <StatCard emoji="⏳" label="Outstanding"        value={fmt(stats.pending)} color={t.amber}  bgColor={t.amberLight}  border="rgba(217,119,6,0.2)"  shadow={t.card} />
          <StatCard emoji="📊" label="Collection Rate"   value={`${stats.rate}%`}   color={t.blue}   bgColor={t.blueLight}   border="rgba(37,99,235,0.2)"  shadow={t.card} />
        </div>

        {/* ── Filter ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["all","paid","pending"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: "6px 16px", borderRadius: "10px", border: "none", fontWeight: 700,
                  fontSize: "13px", cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s",
                  background: filter === f ? "linear-gradient(135deg, #16A34A 0%, #0891B2 100%)" : t.surfaceAlt,
                  color: filter === f ? "#fff" : t.textSec,
                  boxShadow: filter === f ? "0 4px 12px rgba(22,163,74,0.3)" : "none",
                }}>
                {f}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "12px", color: t.textSec, fontWeight: 500 }}>
            {filteredList.length} of {list.length} invoices
          </span>
        </div>

        {/* ── Table ────────────────────────────────────────────────── */}
        <div style={{ background: t.surface, borderRadius: "20px", border: `1px solid ${t.border}`, boxShadow: t.card, overflow: "hidden" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
              <CircularProgress size={40} sx={{ color: "#16A34A" }} />
            </div>
          ) : filteredList.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", color: t.textSec, textAlign: "center" }}>
              <ReceiptLongIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
              <div style={{ fontSize: "18px", fontWeight: 800, color: t.text, marginBottom: "6px" }}>No Invoices Yet</div>
              <div style={{ fontSize: "14px" }}>Your billing records will appear here.</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                <thead>
                  <tr style={{ background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(22,163,74,0.05)", borderBottom: `1px solid ${t.border}` }}>
                    {[
                      { label: "Invoice #" },
                      { label: "Patient" },
                      { label: "Appointment Date", icon: <DateRangeIcon sx={{ fontSize: 14 }} /> },
                      { label: "Amount", icon: <AccountBalanceWalletIcon sx={{ fontSize: 14 }} /> },
                      { label: "Status" },
                      ...(canMarkPaid ? [{ label: "Action", right: true }] : []),
                    ].map(({ label, icon, right }, i) => (
                      <th key={i} style={{ textAlign: right ? "right" : "left", padding: "14px 20px", fontSize: "11px", textTransform: "uppercase", color: t.textSec, fontWeight: 700, letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                        {icon ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{icon}{label}</span> : label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((bill, idx) => {
                    const id = bill.billing_id ?? bill.id;
                    return (
                      <tr key={id} className="bill-row-hover" style={{ borderBottom: `1px solid ${t.border}`, animation: `fadeRow 0.3s ease ${idx * 0.02}s both` }}>
                        <td style={{ padding: "16px 20px", fontWeight: 800, color: t.isDark ? "#A78BFA" : "#7C3AED", fontSize: "14px" }}>#{id}</td>
                        <td style={{ padding: "16px 20px", fontWeight: 600, color: t.text, fontSize: "14px" }}>{bill.patient_name || `Patient #${bill.patient_id}`}</td>
                        <td style={{ padding: "16px 20px", color: t.textSec, fontSize: "13px" }}>
                          {bill.appointment_date ? new Date(bill.appointment_date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                        </td>
                        <td style={{ padding: "16px 20px", fontWeight: 800, color: t.text, fontSize: "15px" }}>
                          ₹{Number(bill.amount).toFixed(2)}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <StatusBadge status={bill.status} mode={mode} />
                        </td>
                        {canMarkPaid && (
                          <td style={{ padding: "16px 20px", textAlign: "right" }}>
                            <button onClick={() => handleTogglePaid(bill)} disabled={actionLoading}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                padding: "6px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 700,
                                cursor: "pointer", border: "none", transition: "all 0.2s",
                                background: bill.status === "paid" ? t.amberLight : t.greenLight,
                                color: bill.status === "paid" ? t.amber : t.green,
                              }}>
                              {bill.status === "paid" ? <><ErrorOutlineIcon sx={{ fontSize: 14 }} /> Undo</> : <><CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> Mark Paid</>}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateInvoiceDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onCreate={handleCreate} loading={actionLoading} error={actionError} mode={mode} />
    </>
  );
};

export default BillingPage;
