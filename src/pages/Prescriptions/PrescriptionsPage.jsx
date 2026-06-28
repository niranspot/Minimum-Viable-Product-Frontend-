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
import MedicationIcon from "@mui/icons-material/Medication";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import styled from "styled-components";
import { useSelector } from "react-redux";
import usePrescriptions from "../../modules/prescriptions/hooks/usePrescriptions";

// ─── Styled (structural / layout only) ───────────────────────────────────────

const PageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RxCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RxHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const RxMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RxMedicines = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
  padding: 10px 12px;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
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
  grid-column: 1 / -1;
`;

// ─── Status chip ─────────────────────────────────────────────────────────────

const STATUS_COLOR = {
  created: "info",
  verified: "warning",
  dispensed: "success",
};

const StatusChip = ({ status }) => (
  <Chip
    label={status}
    color={STATUS_COLOR[status] || "default"}
    size="small"
    sx={{ fontWeight: 600, textTransform: "capitalize" }}
  />
);

// ─── Next-status logic ───────────────────────────────────────────────────────
// created -> verified (pharmacist/admin)
// verified -> dispensed (pharmacist/admin)
// doctor can only create; admin can move it either step.

const NEXT_STATUS = { created: "verified", verified: "dispensed" };

// ─── Create prescription dialog ──────────────────────────────────────────────

const CreatePrescriptionDialog = ({
  open,
  onClose,
  onCreate,
  loading,
  error,
}) => {
  const [form, setForm] = useState({
    patient_id: "",
    appointment_id: "",
    medicines: "",
  });

  useEffect(() => {
    if (open) setForm({ patient_id: "", appointment_id: "", medicines: "" });
  }, [open]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const isValid =
    form.patient_id && form.appointment_id && form.medicines.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    onCreate({
      patient_id: Number(form.patient_id),
      appointment_id: Number(form.appointment_id),
      medicines: form.medicines.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Prescription</DialogTitle>
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
          />
          <TextField
            label="Appointment ID"
            type="number"
            fullWidth
            required
            value={form.appointment_id}
            onChange={handleChange("appointment_id")}
            helperText="The appointment this prescription was written for"
          />
          <TextField
            label="Medicines"
            fullWidth
            required
            multiline
            minRows={3}
            value={form.medicines}
            onChange={handleChange("medicines")}
            placeholder={
              "e.g. Amoxicillin 500mg — 1 tablet 3x/day for 5 days\nParacetamol 650mg — as needed for fever"
            }
            helperText="List each medicine, dosage, and instructions"
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
            "Create Prescription"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Row action menu (status change / delete) ────────────────────────────────

const RxActionsMenu = ({ rx, canAdvance, canDelete, onAdvance, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const nextStatus = NEXT_STATUS[rx.status];

  if (!canAdvance && !canDelete) return null;

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {canAdvance && nextStatus && (
          <MenuItem
            onClick={() => {
              onAdvance(rx, nextStatus);
              setAnchorEl(null);
            }}
          >
            Mark as {nextStatus}
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={() => {
              onDelete(rx);
              setAnchorEl(null);
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const PrescriptionsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    list,
    loading,
    error,
    actionLoading,
    actionError,
    fetchPrescriptions,
    createPrescription,
    updatePrescriptionStatus,
    deletePrescription,
    clearError,
  } = usePrescriptions();

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canCreate = user?.role === "doctor";
  const canAdvance = ["pharmacist", "admin", "doctor"].includes(user?.role);
  const canDelete = ["admin", "doctor"].includes(user?.role);

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

  const handleCreate = (data) => createPrescription(data);
  const handleAdvance = (rx, nextStatus) =>
    updatePrescriptionStatus(rx.id, nextStatus);
  const handleDelete = (rx) => deletePrescription(rx.id);

  return (
    <Box>
      <PageHeader>
        <Box>
          <Typography variant="h2">Prescriptions</Typography>
          <Typography variant="body2" color="text.secondary">
            Created by doctors, verified and dispensed by pharmacy
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={fetchPrescriptions} disabled={loading}>
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
              New Prescription
            </Button>
          )}
        </Stack>
      </PageHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <CardGrid>
          {list.length === 0 ? (
            <EmptyState>
              <MedicationIcon sx={{ fontSize: 40, opacity: 0.5 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                No prescriptions yet
              </Typography>
              <Typography variant="body2">
                {canCreate
                  ? "Create a prescription to get started."
                  : "Prescriptions will appear here once a doctor creates one."}
              </Typography>
            </EmptyState>
          ) : (
            list.map((rx) => (
              <RxCard key={rx.id}>
                <RxHeaderRow>
                  <RxMeta>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "text.primary" }}
                    >
                      Rx #{rx.id}
                    </Typography>
                    <span>Doctor: {rx.doctor_name || `#${rx.doctor_id}`}</span>
                    <span>Patient: #{rx.patient_id}</span>
                    <span>
                      {rx.created_at
                        ? new Date(rx.created_at).toLocaleString()
                        : ""}
                    </span>
                  </RxMeta>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ alignItems: "center" }}
                  >
                    <StatusChip status={rx.status} />
                    <RxActionsMenu
                      rx={rx}
                      canAdvance={canAdvance}
                      canDelete={canDelete}
                      onAdvance={handleAdvance}
                      onDelete={handleDelete}
                    />
                  </Stack>
                </RxHeaderRow>

                <RxMedicines>{rx.medicines}</RxMedicines>
              </RxCard>
            ))
          )}
        </CardGrid>
      )}

      <CreatePrescriptionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        loading={actionLoading}
        error={actionError}
      />
    </Box>
  );
};

export default PrescriptionsPage;
