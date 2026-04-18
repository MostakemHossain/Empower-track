import React, { useState, useEffect } from "react";
import {
  dummyAttendanceData,
  getWorkingHoursDisplay,
  getDayTypeDisplay,
} from "../assets/assets.jsx";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] =
    useState(dummyAttendanceData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentStatus, setCurrentStatus] = useState("OUT"); 


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const totalPresent = attendanceRecords.filter(
    (r) => r.status === "PRESENT"
  ).length;
  const avgHours = (
    attendanceRecords.reduce((acc, curr) => acc + (curr.workingHours || 0), 0) /
    attendanceRecords.length
  ).toFixed(1);

  const handleCheckIn = () => {
    const newRecord = {
      _id: Date.now().toString(),
      date: new Date().toISOString(),
      checkIn: new Date().toISOString(),
      checkOut: null,
      status: "PRESENT",
      workingHours: null,
      dayType: null, // This will be handled by getDayTypeDisplay "In Progress"
    };

    setAttendanceRecords([newRecord, ...attendanceRecords]);
    setCurrentStatus("IN");
  };

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen font-sans">
      {/* UPPER SECTION: HEADER & PUNCH CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* WELCOME & CLOCK */}
        <div className="lg:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
            Work Log
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black text-indigo-600">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-xl font-bold text-indigo-400">
              {
                currentTime
                  .toLocaleTimeString([], { second: "2-digit" })
                  .split(" ")[0]
              }
            </span>
          </div>
        </div>

        {/* PUNCH CARD */}
        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              currentStatus === "IN"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
            Shift Status
          </p>
          <h3
            className={`text-xl font-bold mb-6 ${
              currentStatus === "IN" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {currentStatus === "IN" ? "Currently On-Duty" : "Ready to Start?"}
          </h3>

          <button
            onClick={handleCheckIn}
            disabled={currentStatus === "IN"}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-lg active:scale-95 ${
              currentStatus === "IN"
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {currentStatus === "IN" ? "CHECKED IN" : "CHECK IN"}
          </button>

          {currentStatus === "IN" && (
            <button className="mt-4 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-wider">
              Finish Shift (Check Out)
            </button>
          )}
        </div>
      </div>

      {/* STATS SUMMARY GRID */}
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Total Present
          </p>
          <h2 className="text-3xl font-black mt-2">{totalPresent}</h2>
          <p className="text-xs opacity-80">Working days</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Avg Hours
          </p>
          <h2 className="text-3xl font-black mt-2">{avgHours}</h2>
          <p className="text-xs opacity-80">Per day</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Records
          </p>
          <h2 className="text-3xl font-black mt-2">
            {attendanceRecords.length}
          </h2>
          <p className="text-xs opacity-80">This month</p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              
              <th className="text-left px-8 py-5">#</th>
              <th className="text-left px-8 py-5">Date</th>
              <th className="text-left px-8 py-5">Check In</th>
              <th className="text-left px-8 py-5">Check Out</th>
              <th className="text-left px-8 py-5">Duration</th>
              <th className="text-left px-8 py-5">Type</th>
              <th className="text-right px-8 py-5">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {attendanceRecords.map((record,index) => {
              const dayType = getDayTypeDisplay(record);
              const isLive = !record.checkOut;

              return (
                <tr
                  key={record._id}
                  className="hover:bg-indigo-50/40 transition"
                >
                   <td className="px-8 py-5 font-bold text-slate-700">
                    {index + 1}
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-800">
                    {new Date(record.date).toDateString()}
                    {isLive && (
                      <div className="text-[10px] text-indigo-500 font-bold">
                        TODAY
                      </div>
                    )}
                  </td>

                  <td className="px-8 py-5 text-slate-600 font-semibold">
                    {new Date(record.checkIn).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="px-8 py-5">
                    {record.checkOut ? (
                      new Date(record.checkOut).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    ) : (
                      <span className="text-indigo-500 font-bold">Active</span>
                    )}
                  </td>

                  <td className="px-8 py-5 font-black text-indigo-600">
                    {getWorkingHoursDisplay(record)}
                  </td>

                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full text-xs bg-slate-100 font-bold">
                      {dayType.label}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        record.status === "PRESENT"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
