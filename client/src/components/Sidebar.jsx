import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  DollarSign,
  Settings,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { dummyProfileData } from "../assets/assets";

const Sidebar = ({ role = "admin" }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName =
    dummyProfileData.firstName + " " + dummyProfileData.lastName;

  // 🔥 Menu based on role
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ...(role === "admin"
      ? [{ label: "Employees", icon: Users, path: "/employees" }]
      : []),
    { label: "Attendance", icon: CalendarDays, path: "/attendance" },
    { label: "Leave", icon: FileText, path: "/leave" },
    { label: "Payslips", icon: DollarSign, path: "/payslips" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  // 🔴 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* 🔹 Mobile Top Bar (ONLY Hamburger) */}
      <div className="md:hidden  p-2  text-[#0B1739] shadow-md sticky top-0 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg  hover:bg-white/10 transition active:scale-95"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 🔹 Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-72 bg-gradient-to-b from-[#0B1739] to-[#020617] text-white z-50 transform transition-all duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold tracking-wide">
              Employee MS
            </h2>
            <p className="text-xs text-gray-400">
              Management System
            </p>
          </div>
          <button
            className="md:hidden hover:rotate-90 transition"
            onClick={() => setMobileOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Profile */}
        <div className="p-4">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:border-indigo-500 transition">
            <div className="w-11 h-11 flex items-center justify-center bg-indigo-600/20 text-indigo-400 rounded-xl font-semibold text-lg">
              {userName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide">
                {userName}
              </h3>
              <p className="text-xs text-gray-400 capitalize">
                {role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3">
          <p className="text-xs text-gray-500 px-2 mb-3 tracking-wider">
            NAVIGATION
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {/* Active Indicator */}
                  <span
                    className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-300
                    ${
                      isActive
                        ? "bg-indigo-400"
                        : "bg-transparent group-hover:bg-indigo-500/50"
                    }`}
                  />

                  <Icon
                    size={18}
                    className={`transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />

                  <span className="text-sm font-medium tracking-wide">
                    {item.label}
                  </span>

                  {/* Hover Glow */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-500/10 to-transparent transition duration-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 🔻 Footer */}
        <div className="absolute bottom-4 left-0 w-full px-4 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-red-500/20 transition-all duration-300 group"
          >
            <LogOut
              size={18}
              className="group-hover:-rotate-12 transition"
            />
            <span className="text-sm font-medium">Logout</span>
          </button>

          <div className="text-xs text-gray-500 text-center">
            © 2026 EMS
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;