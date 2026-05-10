import React, { useState, useEffect } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/get-my-attendance");
      setAttendanceRecords(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toDateString();
  const latestRecord = attendanceRecords[0];

  const isCurrentlyIn =
    latestRecord &&
    !latestRecord.checkOut &&
    new Date(latestRecord.date).toDateString() === todayStr;

  const hasFinishedToday =
    latestRecord &&
    latestRecord.checkOut &&
    new Date(latestRecord.date).toDateString() === todayStr;

  const handlePunch = async () => {
    if (processing) return;

    setProcessing(true);
    try {
      const res = await api.post("/attendance/check-in-out");
      await fetchAttendance();
      toast.success(res.data?.message || "Success");
    } catch (error) {
      toast.success(error.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  // Stats Logic
  const totalPresent = attendanceRecords.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE"
  ).length;
  const avgHours =
    attendanceRecords.length > 0
      ? (
          attendanceRecords.reduce(
            (acc, curr) => acc + (curr.workingHours || 0),
            0
          ) / attendanceRecords.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen font-sans">
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
        <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              isCurrentlyIn
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
              hasFinishedToday
                ? "text-slate-400"
                : isCurrentlyIn
                ? "text-emerald-600"
                : "text-indigo-500"
            }`}
          >
            {hasFinishedToday
              ? "Shift Completed"
              : isCurrentlyIn
              ? "Currently On-Duty"
              : "Ready to Start?"}
          </h3>

          <button
            onClick={handlePunch}
            disabled={processing || hasFinishedToday}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-lg active:scale-95 ${
              hasFinishedToday
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                : isCurrentlyIn
                ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {isCurrentlyIn ? "CHECK OUT" : "CHECK IN"}
          </button>

          {isCurrentlyIn && !processing && (
            <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              Dont forget to check out!
            </p>
          )}
        </div>
      </div>

      {/* STATS SUMMARY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Total Days
          </p>
          <h2 className="text-3xl font-black mt-2">{totalPresent}</h2>
          <p className="text-xs opacity-80">This session</p>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-r from-indigo-500 to-blue-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Avg Hours
          </p>
          <h2 className="text-3xl font-black mt-2">{avgHours}</h2>
          <p className="text-xs opacity-80">Per day</p>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Total Records
          </p>
          <h2 className="text-3xl font-black mt-2">
            {attendanceRecords.length}
          </h2>
          <p className="text-xs opacity-80">Database entries</p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
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
              {attendanceRecords.map((record, index) => {
                const isLive =
                  !record.checkOut &&
                  new Date(record.date).toDateString() === todayStr;

                return (
                  <tr
                    key={record._id}
                    className="hover:bg-indigo-50/40 transition group"
                  >
                    <td className="px-8 py-5 font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {attendanceRecords.length - index}
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-800">
                      {new Date(record.date).toDateString()}
                      {isLive && (
                        <div className="text-[10px] text-indigo-500 font-black animate-pulse">
                          ACTIVE NOW
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
                        <span className="text-indigo-500 font-bold italic">
                          Processing...
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-5 font-black text-indigo-600">
                      {record.workingHours
                        ? `${record.workingHours} hrs`
                        : "--"}
                    </td>

                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full text-[10px] bg-slate-100 font-black uppercase text-slate-500">
                        {record.dayType || "Calculating"}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
                          record.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-700"
                            : record.status === "LATE"
                            ? "bg-amber-100 text-amber-700"
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
        {attendanceRecords.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-medium">
            No attendance records found. Start your first shift!
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
