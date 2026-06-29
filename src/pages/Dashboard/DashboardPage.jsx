import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { Table, Tag } from "antd";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import MedicalIcon from "@mui/icons-material/MedicalServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import styled from "styled-components";
import useDashboard from "../../modules/dashboard/hooks/useDashboard";
import { useSelector } from "react-redux";

// ── Styled ─────────────────────────────────────────────────────
const PageWrapper = styled.div`
  background: ${({ theme }) => theme.bg};
  min-height: 100%;
`;

const SummaryCard = styled.div`
  background: ${({ bg }) => bg};
  border-radius: 14px;
  padding: 20px 24px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 16px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DataCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 12px;
  padding: 20px;
  height: 100%;
`;

const SectionTitle = styled(Typography)`
  font-weight: 700 !important;
  margin-bottom: 16px !important;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

// ── Table columns for per-day appointments ────────────────────
const perDayColumns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Appointments",
    dataIndex: "count",
    key: "count",
    render: (v) => <Tag color="blue">{v}</Tag>,
  },
];

// ── Table columns for per-doctor ──────────────────────────────
const perDoctorColumns = [
  {
    title: "Doctor",
    dataIndex: "doctor_name",
    key: "doctor_name",
    render: (v) => (
      <Typography variant="body2" fontWeight={600}>
        {v}
      </Typography>
    ),
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (v) => <Tag color="blue">{v}</Tag>,
  },
  {
    title: "Completed",
    dataIndex: "completed",
    key: "completed",
    render: (v) => <Tag color="green">{v}</Tag>,
  },
  {
    title: "Cancelled",
    dataIndex: "cancelled",
    key: "cancelled",
    render: (v) => <Tag color="red">{v}</Tag>,
  },
];

const perPrescriptionDoctorColumns = [
  {
    title: "Doctor",
    dataIndex: "doctor_name",
    key: "doctor_name",
    render: (v) => (
      <Typography variant="body2" fontWeight={600}>
        {v}
      </Typography>
    ),
  },
  {
    title: "Created",
    dataIndex: "created",
    key: "created",
    render: (v) => <Tag color="blue">{v}</Tag>,
  },
  {
    title: "Verified",
    dataIndex: "verified",
    key: "verified",
    render: (v) => <Tag color="orange">{v}</Tag>,
  },
  {
    title: "Dispensed",
    dataIndex: "dispensed",
    key: "dispensed",
    render: (v) => <Tag color="green">{v}</Tag>,
  },
];

const buildPrescriptionRows = (byStatusAndDoctor = []) => {
  const byDoctor = {};
  byStatusAndDoctor.forEach((row) => {
    const key = row.doctor_id;
    if (!byDoctor[key]) {
      byDoctor[key] = {
        doctor_id: row.doctor_id,
        doctor_name: row.doctor_name,
        created: 0,
        verified: 0,
        dispensed: 0,
      };
    }
    if (byDoctor[key][row.status] !== undefined)
      byDoctor[key][row.status] = row.count;
  });
  return Object.values(byDoctor);
};

// ── Component ──────────────────────────────────────────────────
const DashboardPage = () => {
  const {
    summary,
    appointments,
    prescriptions,
    tenantAnalytics,
    loading,
    error,
    fetchDashboard,
    fetchTenantAnalytics,
  } = useDashboard();

  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchDashboard();
    if (isAdmin) fetchTenantAnalytics();
  }, [isAdmin]);

  if (loading && !summary) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const apptStats = summary?.appointment_stats || {};
  const rxSummary = summary?.prescription_summary || {};

  const statCards = [
    {
      label: "Total Patients",
      value: summary?.total_patients ?? "—",
      icon: <PeopleIcon />,
      bg: "#1565C0",
    },
    {
      label: "Total Appointments",
      value: apptStats.total ?? "—",
      icon: <EventIcon />,
      bg: "#1B8A5A",
    },
    {
      label: "Total Prescriptions",
      value: rxSummary.total ?? "—",
      icon: <MedicalIcon />,
      bg: "#7B1FA2",
    },
    {
      label: "Completed Appointments",
      value: apptStats.completed ?? "—",
      icon: <CheckCircleIcon />,
      bg: "#2E7D32",
    },
  ];

  const perDay = appointments?.per_day || [];
  const perDoctor = appointments?.per_doctor || [];
  const perPrescriptionDoctor = buildPrescriptionRows(
    prescriptions?.by_status_and_doctor,
  );

  return (
    <PageWrapper>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Top Summary Cards ──────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCard bg={s.bg}>
              <IconBox>{s.icon}</IconBox>
              <Box>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.85)", mt: 0.5 }}>
                  {s.label}
                </Typography>
              </Box>
            </SummaryCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Appointment Status Breakdown + Per Day ─────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DataCard>
            <SectionTitle variant="h6">Appointment Status</SectionTitle>

            <StatusRow>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HourglassIcon sx={{ color: "#F59E0B", fontSize: 18 }} />
                <Typography variant="body2">Pending</Typography>
              </Box>
              <Chip
                label={apptStats.pending ?? 0}
                size="small"
                sx={{ bgcolor: "#FFF3E0", color: "#E65100", fontWeight: 700 }}
              />
            </StatusRow>
            <Divider />

            <StatusRow>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EventIcon sx={{ color: "#1565C0", fontSize: 18 }} />
                <Typography variant="body2">Confirmed</Typography>
              </Box>
              <Chip
                label={apptStats.confirmed ?? 0}
                size="small"
                sx={{ bgcolor: "#E3F2FD", color: "#1565C0", fontWeight: 700 }}
              />
            </StatusRow>
            <Divider />

            <StatusRow>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon sx={{ color: "#2E7D32", fontSize: 18 }} />
                <Typography variant="body2">Completed</Typography>
              </Box>
              <Chip
                label={apptStats.completed ?? 0}
                size="small"
                sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 700 }}
              />
            </StatusRow>
            <Divider />

            <StatusRow>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CancelIcon sx={{ color: "#C62828", fontSize: 18 }} />
                <Typography variant="body2">Cancelled</Typography>
              </Box>
              <Chip
                label={apptStats.cancelled ?? 0}
                size="small"
                sx={{ bgcolor: "#FFEBEE", color: "#C62828", fontWeight: 700 }}
              />
            </StatusRow>
          </DataCard>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <DataCard>
            <SectionTitle variant="h6">Appointments Per Day</SectionTitle>
            <Table
              dataSource={perDay}
              columns={perDayColumns}
              rowKey="date"
              pagination={false}
              size="small"
              loading={loading}
              locale={{ emptyText: "No appointment data yet" }}
            />
          </DataCard>
        </Grid>
      </Grid>

      {/* ── Per Doctor + Admin Tenant Analytics ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: isAdmin ? 6 : 12 }}>
          <DataCard>
            <SectionTitle variant="h6">Appointments by Doctor</SectionTitle>
            <Table
              dataSource={perDoctor}
              columns={perDoctorColumns}
              rowKey="doctor_id"
              pagination={false}
              size="small"
              loading={loading}
              locale={{ emptyText: "No doctor data yet" }}
              scroll={{ x: 400 }}
            />
          </DataCard>
        </Grid>

        <Grid size={{ xs: 12, md: isAdmin ? 6 : 12 }}>
          <DataCard>
            <SectionTitle variant="h6">Prescriptions by Doctor</SectionTitle>
            <Table
              dataSource={perPrescriptionDoctor}
              columns={perPrescriptionDoctorColumns}
              rowKey="doctor_id"
              pagination={false}
              size="small"
              loading={loading}
              locale={{ emptyText: "No prescription data yet" }}
              scroll={{ x: 400 }}
            />
          </DataCard>
        </Grid>

        {/* Admin only: tenant analytics falls cleanly beneath */}
        {isAdmin && tenantAnalytics?.tenants && (
          <Grid size={{ xs: 12 }}>
            <DataCard>
              <SectionTitle variant="h6">Tenant Analytics</SectionTitle>
              <Grid container spacing={2}>
                {tenantAnalytics.tenants.map((t) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.tenant_id}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
                        <Typography variant="body2" fontWeight={700}>
                          {t.tenant_name}
                        </Typography>
                        <Chip
                          label={t.tenant_status}
                          size="small"
                          sx={{
                            bgcolor: t.tenant_status === "active" ? "#E8F5E9" : "#FFEBEE",
                            color: t.tenant_status === "active" ? "#2E7D32" : "#C62828",
                            fontWeight: 600,
                            fontSize: 10,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip label={`${t.total_patients} patients`} size="small" color="primary" variant="outlined" />
                        <Chip label={`${t.total_appointments} appts`} size="small" color="success" variant="outlined" />
                        <Chip label={`${t.total_prescriptions} rx`} size="small" color="secondary" variant="outlined" />
                        <Chip label={`${t.active_users} users`} size="small" variant="outlined" />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </DataCard>
          </Grid>
        )}
      </Grid>
    </PageWrapper>
  );
};

export default DashboardPage;