import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RefreshIcon from "@mui/icons-material/Refresh";
import styled from "styled-components";
import { useSelector } from "react-redux";
import useBilling from "../../modules/billing/hooks/useBilling";

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

// ─── Status chip ───────────────────────────────────────────────────────────

const STATUS_COLOR = {
  pending: "warning",
  paid: "success",
};

const StatusChip = ({ status }) => (
  <Chip
    label={status === "paid" ? "Paid" : "Pending"}
    color={STATUS_COLOR[status] || "default"}
    size="small"
    sx={{ fontWeight: 600, textTransform: "capitalize" }}
  />
);

// ─── Create invoice dialog ─────────────────────────────────────────────────

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Generate Invoice</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Patient ID"
            type="number"
            fullWidth
            required
            value={form.patient_id}
            onChange={handleChange("patient_id")}
            helperText="The patient record this invoice belongs to"
          />
          <TextField
            label="Appointment ID"
            type="number"
            fullWidth
            required
            value={form.appointment_id}
            onChange={handleChange("appointment_id")}
            helperText="The appointment this invoice is billed against"
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            required
            value={form.amount}
            onChange={handleChange("amount")}
            slotProps={{ input: { inputProps: { min: 0, step: "0.01" } } }}
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
            "Generate Invoice"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main page ──────────────────────────────────────────────────────────────

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

  useEffect(() => {
    fetchBilling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canCreate = ["doctor", "nurse"].includes(user?.role);
  const canMarkPaid = user?.role === "admin";

  const handleCreate = (data) => {
    createBilling(data);
  };

  // Close the dialog once a create call succeeds (list grows, no action error)
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

  return (
    <Box>
      <PageHeader>
        <Box>
          <Typography variant="h2">Billing</Typography>
          <Typography variant="body2" color="text.secondary">
            Invoices and payment status across your patients
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={fetchBilling} disabled={loading}>
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
            >
              Generate Invoice
            </Button>
          )}
        </Stack>
      </PageHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={28} />
            </Box>
          ) : list.length === 0 ? (
            <EmptyState>
              <ReceiptLongIcon sx={{ fontSize: 40, opacity: 0.5 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                No invoices yet
              </Typography>
              <Typography variant="body2">
                {canCreate
                  ? "Generate an invoice to get started."
                  : "Invoices will appear here once they are created."}
              </Typography>
            </EmptyState>
          ) : (
            <TableScroll>
              <Table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Patient</th>
                    <th>Appointment Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    {canMarkPaid && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {list.map((bill) => {
                    const id = bill.billing_id ?? bill.id;
                    return (
                      <tr key={id}>
                        <td>#{id}</td>
                        <td>
                          {bill.patient_name || `Patient #${bill.patient_id}`}
                        </td>
                        <td>
                          {bill.appointment_date
                            ? new Date(bill.appointment_date).toLocaleString()
                            : "—"}
                        </td>
                        <td>₹{Number(bill.amount).toFixed(2)}</td>
                        <td>
                          <StatusChip status={bill.status} />
                        </td>
                        {canMarkPaid && (
                          <td>
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={actionLoading}
                              onClick={() => handleTogglePaid(bill)}
                            >
                              Mark as{" "}
                              {bill.status === "paid" ? "Pending" : "Paid"}
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableScroll>
          )}
        </CardContent>
      </Card>

      <CreateInvoiceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        loading={actionLoading}
        error={actionError}
      />
    </Box>
  );
};

export default BillingPage;
