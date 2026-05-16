import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginLanding from "./pages/LoginLanding";
import Layout from "./pages/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/Settings";
import PaySlips from "./pages/PaySlips";
import PrintPaySlip from "./pages/PrintPaySlip";
import LoginForm from "./components/LoginForm";
import AttendancePage from "./pages/Attendance/AttendancePage";
import EmployeesPage from "./pages/Employees/EmployeesPage";
import LeavePage from "./pages/Leave/LeavePage";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding />} />
        <Route
          path="/login/admin"
          element={
            <LoginForm
              role="admin"
              subTitle="Sign in to manage the organization"
            />
          }
        />
        <Route
          path="/login/employee"
          element={
            <LoginForm
              role="employee"
              subTitle="Sign in to access your portal"
            />
          }
        />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/payslips" element={<PaySlips />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/print/payslips/:id" element={<PrintPaySlip />} />

        <Route path="*" element={<Navigate to={"/dashboard"} replace />} />
      </Routes>
    </>
  );
};

export default App;
