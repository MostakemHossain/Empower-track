import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginLanding from "./pages/LoginLanding";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import PaySlips from "./pages/PaySlips";
import Leave from "./pages/Leave";
import Attendance from "./pages/Attendance";
import Employees from "./pages/Employees";
import PrintPaySlip from "./pages/PrintPaySlip";
import LoginForm from "./components/LoginForm";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding />} />
        <Route
          path="/login/admin"
          role="admin"
          title="Admin Portal"
          subTitle="Sign in to manage the organization"
          element={<LoginForm />}
        />
        <Route
          path="/login/employee"
          role="employee"
          title="Employee Portal"
          subTitle="Sign in to access your"
          element={<LoginForm />}
        />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
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
