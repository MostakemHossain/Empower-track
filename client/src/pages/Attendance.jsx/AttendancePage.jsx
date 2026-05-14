// AttendancePage.jsx
import React from "react";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceStats from "./components/AttendanceStats";
import AttendanceTable from "./components/AttendanceTable";
import EmployeePunchCard from "./components/EmployeePunchCard";
import AdminDatePicker from "./components/AdminDatePicker";
import { useAttendance } from "./hooks/useAttendance";
import { useAuth } from "../../context/AuthContext";

const AttendancePage = () => {
  const { user } = useAuth();

  const {
    attendanceRecords,
    currentTime,
    selectedDate,
    setSelectedDate,
    tableLoading,
    processing,
    handlePunch,
    isCurrentlyIn,
    hasFinishedToday,
    totals,
  } = useAttendance(user);

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-start">
        
        {/* HEADER (LEFT - 2 columns) */}
        <div className="lg:col-span-2">
          <AttendanceHeader user={user} currentTime={currentTime} />
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="flex justify-end">
          
          {user?.role === "EMPLOYEE" && (
            <EmployeePunchCard
              processing={processing}
              handlePunch={handlePunch}
              isCurrentlyIn={isCurrentlyIn}
              hasFinishedToday={hasFinishedToday}
            />
          )}

          {user?.role === "ADMIN" && (
            <div className="w-full max-w-sm">
              <AdminDatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          )}

        </div>

      </div>

      {/* STATS */}
      <AttendanceStats
        totals={totals}
        attendanceRecords={attendanceRecords}
      />

      {/* TABLE */}
      <AttendanceTable
        user={user}
        records={attendanceRecords}
        loading={tableLoading}
      />

    </div>
  );
};

export default AttendancePage;