import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

const LoginPage          = lazy(() => import("../pages/Auth/LoginPage"));
const ChangePasswordPage = lazy(() => import("../pages/Auth/ChangePasswordPage"));
const RegisterPage       = lazy(() => import("../pages/Auth/RegisterPage"));
const DashboardPage      = lazy(() => import("../pages/Dashboard/DashboardPage"));
const StaffPage          = lazy(() => import("../pages/Staff/StaffPage"));
const PatientsPage       = lazy(() => import("../pages/Patients/PatientsPage"));
const AppointmentsPage   = lazy(() => import("../pages/Appointments/AppointmentsPage"));
const CommunicationPage  = lazy(() => import("../pages/Communication/CommunicationPage"));
const BillingPage        = lazy(() => import("../pages/Billing/BillingPage"));
const PrescriptionsPage  = lazy(() => import("../pages/Prescriptions/PrescriptionsPage"));
const CalendarPage       = lazy(() => import("../pages/Calendar/CalendarPage"));
const NotificationsPage  = lazy(() => import("../pages/Notifications/NotificationsPage"));

// Patient pages — separate prefix /patient/
const PatientAppointmentsPage = lazy(() => import("../pages/Appointments/AppointmentsPage"));
const PatientPrescriptionsPage = lazy(() => import("../pages/Prescriptions/PrescriptionsPage"));

const Loader = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <CircularProgress />
  </Box>
);

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public */}
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/register"        element={<RegisterPage />} />

        {/* Staff routes — /dashboard prefix */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/dashboard/staff" element={
          <ProtectedRoute><DashboardLayout><StaffPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/dashboard/patients" element={
          <ProtectedRoute><DashboardLayout><PatientsPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/dashboard/appointments" element={
          <ProtectedRoute><DashboardLayout><AppointmentsPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/dashboard/communication" element={
          <ProtectedRoute><DashboardLayout><CommunicationPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/dashboard/billing" element={
          <ProtectedRoute><DashboardLayout><BillingPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/dashboard/prescriptions" element={
          <ProtectedRoute><DashboardLayout><PrescriptionsPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/dashboard/calendar" element={
          <ProtectedRoute><DashboardLayout><CalendarPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/dashboard/notifications" element={
          <ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>
        }/>

        {/* Patient routes — /patient prefix */}
        <Route path="/patient/appointments" element={
          <ProtectedRoute><DashboardLayout><PatientAppointmentsPage /></DashboardLayout></ProtectedRoute>
        }/>
        <Route path="/patient/prescriptions" element={
          <ProtectedRoute><DashboardLayout><PatientPrescriptionsPage /></DashboardLayout></ProtectedRoute>
        }/>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;