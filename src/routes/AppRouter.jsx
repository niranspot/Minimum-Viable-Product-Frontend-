import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import RoleProtectedRoute from "./RoleProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getSubdomain } from '../utils/tenantUtils';
import PublicRoute from './PublicRoute'

// Public Landing Pages
const LandingPage       = lazy(() => import('../pages/Landing/LandingPage'));
const TenantSignupPage  = lazy(() => import('../pages/Landing/TenantSignupPage'));

// Tenant Auth Pages
const LoginPage         = lazy(() => import("../pages/Auth/LoginPage"));
const RegisterPage      = lazy(() => import("../pages/Auth/RegisterPage"));
const ChangePasswordPage = lazy(() => import("../pages/Auth/ChangePasswordPage"));

// Tenant Dashboard Pages
const DashboardPage     = lazy(() => import("../pages/Dashboard/DashboardPage"));
const StaffPage         = lazy(() => import("../pages/Staff/StaffPage"));
const PatientsPage      = lazy(() => import("../pages/Patients/PatientsPage"));
const AppointmentsPage  = lazy(() => import("../pages/Appointments/AppointmentsPage"));
const CommunicationPage = lazy(() => import("../pages/Communication/CommunicationPage"));
const BillingPage       = lazy(() => import("../pages/Billing/BillingPage"));
const PrescriptionsPage = lazy(() => import("../pages/Prescriptions/PrescriptionsPage"));
const CalendarPage      = lazy(() => import("../pages/Calendar/CalendarPage"));
const NotificationsPage = lazy(() => import("../pages/Notifications/NotificationsPage"));

const PatientAppointmentsPage = lazy(() => import("../pages/Appointments/PatientAppointmentsPage"));
const PatientPrescriptionsPage = lazy(() => import("../pages/Prescriptions/PatientPrescriptionsPage"));


const Loader = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <CircularProgress />
  </Box>
);

const AppRouter = () => {
  const subdomain = getSubdomain();

  // Case A: Root domain logic (e.g., app.com)
  if (!subdomain) {
    return (
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/"       element={<LandingPage />} />
            <Route path="/signup" element={<TenantSignupPage />} />
            <Route path="*"       element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }

  // Case B: Tenant subdomain logic (e.g., clinic1.app.com)
  return (
    // Case B: Tenant subdomain logic

    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"                 element={<Navigate to="/login" replace />} />
          <Route path="/login"            element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"         element={<PublicRoute><RegisterPage /></PublicRoute>} />
          {/* <Route path="/change-password"  element={<ChangePasswordPage />} /> */}
          {/* remove /signup from tenant subdomain too */}

 {/* Patient routes */}
<Route
  path="/patient/appointments"
  element={
    <RoleProtectedRoute allowedRoles={['patient']}>
      <PatientAppointmentsPage />
    </RoleProtectedRoute>
  }
/>
<Route
  path="/patient/prescriptions"
  element={
    <RoleProtectedRoute allowedRoles={['patient']}>
      <PatientPrescriptionsPage />
    </RoleProtectedRoute>
  }
/>

{/* Staff dashboard routes */}
<Route
  path="/dashboard"
  element={
    <RoleProtectedRoute allowedRoles={['admin','doctor','nurse','pharmacist']}>
      <DashboardLayout><Outlet /></DashboardLayout>
    </RoleProtectedRoute>
  }
>
  <Route index element={<DashboardPage />} />
  <Route path="staff" element={<StaffPage />} />
  <Route path="patients" element={<PatientsPage />} />
  <Route path="appointments" element={<AppointmentsPage />} />
  <Route path="communication" element={<CommunicationPage />} />
  <Route path="billing" element={<BillingPage />} />
  <Route path="prescriptions" element={<PrescriptionsPage />} />
  <Route path="calendar" element={<CalendarPage />} />
  <Route path="notifications" element={<NotificationsPage />} />
</Route>

<Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
      </Suspense>
    </BrowserRouter>

  );
};

export default AppRouter;