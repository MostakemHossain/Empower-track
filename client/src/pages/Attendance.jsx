import React, { useState, useEffect } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader2 } from "lucide-react";

const Attendance = () => {
  const { user } = useAuth();

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  const [tableLoading, setTableLoading] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchAttendance = async () => {
    try {
      // ONLY FIRST TIME FULL LOADING
      if (!isInitialFetchDone) {
        setPageLoading(true);
      } else {
        setTableLoading(true);
      }

      let res;

      if (user?.role === "EMPLOYEE") {
        res = await api.get("/attendance/get-my-attendance");
      }

      if (user?.role === "ADMIN") {
        res = await api.get(
          `/attendance/get-attendance-by-date?date=${selectedDate}`
        );
      }

      setAttendanceRecords(res?.data?.data || []);

      setIsInitialFetchDone(true);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to fetch attendance"
      );
    } finally {
      setPageLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user?.role === "ADMIN" && isInitialFetchDone) {
      fetchAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const todayStr = new Date().toDateString();

  const latestRecord = user?.role === "EMPLOYEE" ? attendanceRecords[0] : null;

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

      toast.success(res.data?.message || "Success");

      await fetchAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  const totalPresent = attendanceRecords.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE"
  ).length;

  const totalAbsent = attendanceRecords.filter(
    (r) => r.status === "ABSENT"
  ).length;

  const presentEmployees = attendanceRecords.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE"
  );

  const avgHours =
    presentEmployees.length > 0
      ? (
          presentEmployees.reduce(
            (acc, curr) => acc + (curr.workingHours || 0),
            0
          ) / presentEmployees.length
        ).toFixed(2)
      : "0.00";

  if (pageLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
            {user?.role === "ADMIN" ? "Attendance History" : "Work Log"}
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
                  .toLocaleTimeString([], {
                    second: "2-digit",
                  })
                  .split(" ")[0]
              }
            </span>
          </div>
        </div>

        {user?.role === "EMPLOYEE" && (
          <div className="bg-white p-8 rounded-4xl shadow-xl border border-slate-100 flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
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
                  d="M12 6v6h4.5"
                />
              </svg>
            </div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
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
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all ${
                hasFinishedToday
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : isCurrentlyIn
                  ? "bg-rose-500 hover:bg-rose-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              ) : isCurrentlyIn ? (
                "CHECK OUT"
              ) : (
                "CHECK IN"
              )}
            </button>
          </div>
        )}

        {user?.role === "ADMIN" && (
          <div className="bg-white p-6 rounded-4xl shadow-xl border border-slate-100 flex flex-col justify-center">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              Select Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-500 to-teal-500 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Present
          </p>

          <h2 className="text-3xl font-black mt-2">{totalPresent}</h2>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-r from-rose-500 to-pink-500 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">Absent</p>

          <h2 className="text-3xl font-black mt-2">{totalAbsent}</h2>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-r from-indigo-500 to-blue-500 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Avg Hours
          </p>

          <h2 className="text-3xl font-black mt-2">{avgHours}</h2>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-r from-amber-500 to-orange-500 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Records
          </p>

          <h2 className="text-3xl font-black mt-2">
            {attendanceRecords.length}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden relative">
        {tableLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-xl border border-slate-100">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />

              <span className="font-bold text-slate-700">
                Updating attendance...
              </span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-300">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-8 py-5">#</th>

                {user?.role === "ADMIN" && (
                  <>
                    <th className="text-left px-8 py-5">Employee</th>

                    <th className="text-left px-8 py-5">Employee ID</th>
                  </>
                )}

                <th className="text-left px-8 py-5">Date</th>

                <th className="text-left px-8 py-5">Check In</th>

                <th className="text-left px-8 py-5">Check Out</th>

                <th className="text-left px-8 py-5">Hours</th>

                <th className="text-left px-8 py-5">Type</th>

                <th className="text-right px-8 py-5">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((record, index) => (
                <tr
                  key={record._id}
                  className="hover:bg-indigo-50/40 transition"
                >
                  <td className="px-8 py-5 font-bold text-slate-400">
                    {index + 1}
                  </td>

                  {user?.role === "ADMIN" && (
                    <>
                      <td className="px-8 py-5">
                        <h3 className="font-bold text-slate-800">
                          {record.employee?.firstName}{" "}
                          {record.employee?.lastName}
                        </h3>
                      </td>

                      <td className="px-2 py-5 font-semibold text-slate-600">
                        {record.employee?.employeeId}
                      </td>
                    </>
                  )}

                  <td className="px-8 py-5 font-semibold text-slate-700">
                    {new Date(record.date).toLocaleDateString()}
                  </td>

                  <td className="px-8 py-5">
                    {record.checkIn
                      ? new Date(record.checkIn).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--"}
                  </td>

                  <td className="px-8 py-5">
                    {record.checkOut
                      ? new Date(record.checkOut).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--"}
                  </td>

                  <td className="px-8 py-5 font-bold text-indigo-600">
                    {record.workingHours ? `${record.workingHours} hrs` : "--"}
                  </td>

                  <td className="px-2 py-2">
                    <span className="px-0 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                      {record.dayType || "N/A"}
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
              ))}
            </tbody>
          </table>
        </div>

        {attendanceRecords.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-medium">
            No attendance records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
