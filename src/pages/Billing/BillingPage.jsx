import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
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
  MenuItem,
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

// ─── Status Badge ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const isPaid = status === "paid";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "30px",
        fontSize: "12px",
        fontWeight: 700,
        textTransform: "uppercase",
        background: isPaid ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
        color: isPaid ? "#10b981" : "#f59e0b",
        border: `1px solid ${isPaid ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: isPaid ? "#10b981" : "#f59e0b",
        }}
      />
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
};

// ─── Create Invoice Dialog ──────────────────────────────────────────────────

const CreateInvoiceDialog = ({ open, onClose, onCreate, loading, error }) => {
  const [form, setForm] = useState({
    patient_id: "",
    appointment_id: "",
    amount: "",
  });

  useEffect(() => {
    if (open) setForm({ patient_id: "", appointment_id: "", amount: "" });
  }, [open]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.patient_id || !form.appointment_id || !form.amount) return;
    onCreate({
      patient_id: Number(form.patient_id),
      appointment_id: Number(form.appointment_id),
      amount: Number(form.amount),
    });
  };

  const isValid = form.patient_id && form.appointment_id && form.amount;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: "20px", pb: 1, color: "#1e3c72" }}>
        🧾 Generate New Invoice
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "14px" }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2.5} sx={{ mt: 1.5 }}>
          <TextField
            label="Patient ID"
            type="number"
            fullWidth
            required
            value={form.patient_id}
            onChange={handleChange("patient_id")}
            helperText="The profile ID of the patient record to invoice"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
              },
            }}
          />
          <TextField
            label="Appointment ID"
            type="number"
            fullWidth
            required
            value={form.appointment_id}
            onChange={handleChange("appointment_id")}
            helperText="The unique appointment linked for audit billing"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
              },
            }}
          />
          <TextField
            label="Amount (₹)"
            type="number"
            fullWidth
            required
            value={form.amount}
            onChange={handleChange("amount")}
            slotProps={{ input: { inputProps: { min: 0, step: "0.01" } } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700 }} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValid || loading}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            padding: "8px 20px",
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            boxShadow: "0 4px 12px rgba(42, 82, 152, 0.2)",
            "&:hover": {
              background: "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)",
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Publish Invoice"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const BillingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    list,
    loading,
    error,
    actionLoading,
    actionError,
    fetchBilling,
    createBilling,
    updateBillingStatus,
    clearError,
  } = useBilling();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all' | 'paid' | 'pending'
  const activeSubdomain = getSubdomain() || "medicloud";

  useEffect(() => {
    fetchBilling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canCreate = ["doctor", "nurse"].includes(user?.role);
  const canMarkPaid = user?.role === "admin";

  const handleCreate = (data) => {
    createBilling(data);
  };

  const prevListLength = React.useRef(list.length);
  useEffect(() => {
    if (
      dialogOpen &&
      !actionLoading &&
      !actionError &&
      list.length > prevListLength.current
    ) {
      setDialogOpen(false);
    }
    prevListLength.current = list.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length, actionLoading, actionError]);

  const handleTogglePaid = (bill) => {
    const id = bill.billing_id ?? bill.id;
    const nextStatus = bill.status === "paid" ? "pending" : "paid";
    updateBillingStatus(id, nextStatus);
  };

  // Memoized stats calculation
  const stats = useMemo(() => {
    let totalAmt = 0;
    let paidAmt = 0;
    let pendingAmt = 0;
    let pendingCount = 0;

    list.forEach((bill) => {
      const amount = Number(bill.amount || 0);
      totalAmt += amount;
      if (bill.status === "paid") {
        paidAmt += amount;
      } else {
        pendingAmt += amount;
        pendingCount += 1;
      }
    });

    const rate = totalAmt > 0 ? (paidAmt / totalAmt) * 100 : 0;

    return {
      total: totalAmt,
      paid: paidAmt,
      pending: pendingAmt,
      pendingCount,
      collectionRate: rate.toFixed(1),
    };
  }, [list]);

  // Filtered bills
  const filteredList = useMemo(() => {
    if (filter === "all") return list;
    return list.filter((b) => b.status === filter);
  }, [list, filter]);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .stat-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(30,60,114,0.12) !important;
        }
        .bill-row {
          transition: background-color 0.2s;
        }
        .bill-row:hover {
          background-color: rgba(30,60,114,0.02) !important;
        }
        .glass-box {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          WebkitBackdropFilter: blur(12px);
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05);
        }
      `}</style>

      <Box className="animate-up">
        {/* Header Section */}
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 3, mb: 4 }}>
          <Box>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(24px, 4vw, 36px)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              💳 Finance & Invoices
            </h1>
            <p style={{ margin: "5px 0 0", color: "#6b7280", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              Securely billing accounts. Isolated scope:
              <strong style={{ color: "#3b82f6", textTransform: "uppercase" }}>{activeSubdomain} Database</strong>
            </p>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(16,185,129,0.1)",
              color: "#059669",
              padding: "6px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 700
            }}>
              🔒 Tenant Segregated
            </span>
            <Tooltip title="Refresh Finances">
              <span>
                <IconButton onClick={fetchBilling} disabled={loading} sx={{ color: "#1e3c72" }}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  clearError();
                  setDialogOpen(true);
                }}
                sx={{
                  borderRadius: "14px",
                  fontWeight: 700,
                  textTransform: "none",
                  py: 1,
                  px: 2.5,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 6px 20px rgba(16,185,129,0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  },
                }}
              >
                Generate Invoice
              </Button>
            )}
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "14px" }}>
            {error}
          </Alert>
        )}

        {/* Stats Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 3,
            mb: 4,
          }}
        >
          <Card className="stat-card" sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.03)", background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)" }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>
                Total Invoiced
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#1e293b", mt: 1 }}>
                ₹{stats.total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>

          <Card className="stat-card" sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.03)", background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "#065f46", fontWeight: 700, textTransform: "uppercase" }}>
                Total Received
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#047857", mt: 1 }}>
                ₹{stats.paid.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>

          <Card className="stat-card" sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.03)", background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "#92400e", fontWeight: 700, textTransform: "uppercase" }}>
                Outstanding Amount
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#d97706", mt: 1 }}>
                ₹{stats.pending.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>

          <Card className="stat-card" sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.03)", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "#1e40af", fontWeight: 700, textTransform: "uppercase" }}>
                Collection Rate
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#1d4ed8", mt: 1 }}>
                {stats.collectionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filter Toolbar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Stack direction="row" spacing={1}>
            {["all", "paid", "pending"].map((t) => (
              <Button
                key={t}
                variant={filter === t ? "contained" : "text"}
                onClick={() => setFilter(t)}
                sx={{
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  px: 2,
                  py: 0.5,
                  minWidth: "70px",
                  background: filter === t ? "#1e3c72" : "transparent",
                  color: filter === t ? "#fff" : "#6b7280",
                  "&:hover": {
                    background: filter === t ? "#2a5298" : "rgba(30,60,114,0.05)",
                  },
                }}
              >
                {t}
              </Button>
            ))}
          </Stack>
          
          <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 500 }}>
            Showing {filteredList.length} of {list.length} invoices
          </Typography>
        </Box>

        {/* Main List Table */}
        <Card className="glass-box" sx={{ borderRadius: "24px" }}>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={36} sx={{ color: "#1e3c72" }} />
              </Box>
            ) : filteredList.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, color: "#9ca3af" }}>
                <ReceiptLongIcon sx={{ fontSize: 60, opacity: 0.25, mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#4b5563" }}>
                  No Invoices Listed
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Finances are clear inside this tenant bucket.
                </Typography>
              </Box>
            ) : (
              <div style={{ width: "100%", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "720px" }}>
                  <thead>
                    <tr style={{ background: "rgba(30,60,114,0.03)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                      <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>
                        Invoice #
                      </th>
                      <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>
                        Patient
                      </th>
                      <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                          <DateRangeIcon sx={{ fontSize: 16 }} /> Appointment Date
                        </Box>
                      </th>
                      <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                          <AccountBalanceWalletIcon sx={{ fontSize: 16 }} /> Amount
                        </Box>
                      </th>
                      <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>
                        Status
                      </th>
                      {canMarkPaid && (
                        <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "12px", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((bill, index) => {
                      const id = bill.billing_id ?? bill.id;
                      return (
                        <tr
                          key={id}
                          className="bill-row"
                          style={{
                            borderBottom: "1px solid rgba(0,0,0,0.05)",
                            animation: `fadeIn 0.3s ease ${index * 0.02}s both`,
                          }}
                        >
                          <td style={{ padding: "18px 24px", fontSize: "14px", fontWeight: 800, color: "#1e3c72" }}>
                            #{id}
                          </td>
                          <td style={{ padding: "18px 24px", fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                            {bill.patient_name || `Patient Profile #${bill.patient_id}`}
                          </td>
                          <td style={{ padding: "18px 24px", fontSize: "14px", color: "#6b7280" }}>
                            {bill.appointment_date
                              ? new Date(bill.appointment_date).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </td>
                          <td style={{ padding: "18px 24px", fontSize: "15px", fontWeight: 800, color: "#1f2937" }}>
                            ₹{Number(bill.amount).toFixed(2)}
                          </td>
                          <td style={{ padding: "18px 24px" }}>
                            <StatusBadge status={bill.status} />
                          </td>
                          {canMarkPaid && (
                            <td style={{ padding: "18px 24px", textAlign: "right" }}>
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={actionLoading}
                                onClick={() => handleTogglePaid(bill)}
                                sx={{
                                  borderRadius: "10px",
                                  fontSize: "12px",
                                  textTransform: "none",
                                  fontWeight: 700,
                                  borderColor: bill.status === "paid" ? "#d1d5db" : "#3b82f6",
                                  color: bill.status === "paid" ? "#6b7280" : "#2563eb",
                                  "&:hover": {
                                    borderColor: bill.status === "paid" ? "#9ca3af" : "#1d4ed8",
                                    background: bill.status === "paid" ? "rgba(0,0,0,0.02)" : "rgba(37,99,235,0.05)",
                                  },
                                }}
                              >
                                {bill.status === "paid" ? (
                                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                                    <ErrorOutlineIcon sx={{ fontSize: 13 }} /> Unpay
                                  </Box>
                                ) : (
                                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                                    <CheckCircleOutlineIcon sx={{ fontSize: 13 }} /> Mark Paid
                                  </Box>
                                )}
                              </Button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* dialog */}
      <CreateInvoiceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        loading={actionLoading}
        error={actionError}
      />
    </>
  );
};

export default BillingPage;
