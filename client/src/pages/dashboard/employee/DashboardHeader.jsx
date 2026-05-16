import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const DashboardHeader = ({ data, setOpenModal, refreshData }) => {
  const [processing, setProcessing] = useState(false);

  const todayStr = new Date().toDateString();
  const latestAttendance = data?.recentAttendance?.[0];

  const isClockedIn =
    latestAttendance &&
    !latestAttendance.checkOut &&
    new Date(latestAttendance.date).toDateString() === todayStr;

  const hasFinishedToday =
    latestAttendance &&
    latestAttendance.checkIn &&
    latestAttendance.checkOut &&
    new Date(latestAttendance.date).toDateString() === todayStr;

  const handlePunch = async () => {
    if (processing || hasFinishedToday) return;

    try {
      setProcessing(true);
      const res = await api.post("/attendance/check-in-out");
      toast.success(res.data?.message || "Success");
      refreshData?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setProcessing(false);
    }
  };

  const todayDisplay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
          {data?.employee?.firstName?.[0]?.toUpperCase() || "E"}
        </div>

        <div>
          <h2 className="font-semibold text-gray-800">
            {data?.employee?.firstName} {data?.employee?.lastName}
          </h2>
          <p className="text-sm text-gray-500">{data?.employee?.position}</p>
          <p className="text-xs text-gray-400">{todayDisplay}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handlePunch}
          disabled={processing || hasFinishedToday}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg ${
            hasFinishedToday
              ? "bg-gray-400 text-white"
              : isClockedIn
              ? "bg-rose-500 text-white"
              : "bg-indigo-600 text-white"
          }`}
        >
          {processing && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {hasFinishedToday
            ? "Shift Ended"
            : isClockedIn
            ? "Check Out"
            : "Mark Attendance"}
        </button>

        <button
          onClick={() => setOpenModal(true)}
          className="px-5 py-2.5 rounded-xl text-white bg-linear-to-r from-emerald-500 to-emerald-600 font-bold"
        >
          + Apply Leave
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;