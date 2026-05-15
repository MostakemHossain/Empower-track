import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const Layout = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }
  if (!user) return <Navigate to="/login" />;

  const role = user?.role.toLowerCase();

  return (
    <div className="flex h-screen w-full bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Sidebar */}
    <Sidebar role={role} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
