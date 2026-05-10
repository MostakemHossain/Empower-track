import { useState } from "react";
import Chart from "react-apexcharts";
import toast from "react-hot-toast";
import api from "../api/axios";

const EmployeeDashboard = ({ data, refreshData }) => {
  const [openModal, setOpenModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // ✅ Fix: Define the form state
  const [form, setForm] = useState({
    type: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  /* ================= ATTENDANCE LOGIC ================= */
  const todayStr = new Date().toDateString();
  const latestAttendance = data?.recentAttendance?.[0];

  // Logic: Is user clocked in but hasn't clocked out?
  const isClockedIn =
    latestAttendance &&
    !latestAttendance.checkOut &&
    new Date(latestAttendance.date).toDateString() === todayStr;

  // Logic: Has user finished their shift for today?
  const hasFinishedToday =
    latestAttendance &&
    latestAttendance.checkIn &&
    latestAttendance.checkOut &&
    new Date(latestAttendance.date).toDateString() === todayStr;

  const handlePunch = async () => {
    if (processing || hasFinishedToday) return;

    setProcessing(true);
    try {
      const res = await api.post("/attendance/check-in-out");
      toast.success(res.data?.message || "Success");
      if (refreshData) refreshData(); // Refresh dashboard data
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ================= LEAVE LOGIC ================= */
  const handleSubmit = async () => {
    try {
      if (!form.startDate || !form.endDate || !form.reason) {
        return toast.error("Please fill all fields");
      }

      setSubmitLoading(true);

      await api.post("/leave/create-leave", {
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });

      toast.success("Leave applied successfully");
      setOpenModal(false);
      setForm({ type: "ANNUAL", startDate: "", endDate: "", reason: "" });
      
      if (refreshData) refreshData();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to apply leave");
    } finally {
      setSubmitLoading(false);
    }
  };

  const todayDisplay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* ================= CHARTS CONFIG ================= */
  const attendanceSeries = [{
    name: "Working Hours",
    data: data?.attendanceOverview?.map((d) => d.workingHours || 0) || [],
  }];

  const attendanceOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: data?.attendanceOverview?.map((d) => new Date(d.date).toLocaleDateString()) || [],
    },
  };

  const salarySeries = [{
    name: "Net Salary",
    data: data?.salaryTrend?.map((d) => d.netSalary || 0) || [],
  }];

  const salaryOptions = {
    colors: ["#10B981"],
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: data?.salaryTrend?.map((d) => `${d.month}/${d.year}`) || [],
    },
  };

  const pieSeries = [data?.currentMonthAttendance || 0, data?.pendingLeaves || 0];
  const pieOptions = {
    chart: { type: "donut" },
    labels: ["Attendance", "Leaves"],
    legend: { position: "bottom" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            {data?.employee?.firstName?.[0].toUpperCase() || "E"}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">
              {data?.employee?.firstName} {data?.employee?.lastName}
            </h2>
            <p className="text-sm text-gray-500">{data?.employee?.position}</p>
            <p className="text-xs text-gray-400">{todayDisplay}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handlePunch}
            disabled={processing || hasFinishedToday}
            className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2 ${
              hasFinishedToday 
                ? "bg-gray-400 text-white" 
                : isClockedIn 
                ? "bg-rose-500 text-white" 
                : "bg-indigo-600 text-white"
            }`}
          >
            {processing && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {hasFinishedToday ? "Shift Ended" : isClockedIn ? "Check Out" : "Mark Attendance"}
          </button>

          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2.5 rounded-xl text-white bg-linear-to-r from-emerald-500 to-emerald-600 shadow hover:scale-105 transition font-bold"
          >
            + Apply Leave
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Attendance" value={data?.currentMonthAttendance || 0} color="from-indigo-500 to-indigo-600" />
        <StatCard title="Pending Leaves" value={data?.pendingLeaves || 0} color="from-red-500 to-red-600" />
        <StatCard title="Latest Salary" value={`$${data?.latestPayslip?.netSalary || 0}`} color="from-emerald-500 to-emerald-600" />
        <StatCard title="Total Hours" value={data?.attendanceOverview?.reduce((acc, cur) => acc + (cur.workingHours || 0), 0).toFixed(1)} color="from-blue-500 to-blue-600" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">My Attendance Overview</h2>
          <Chart options={attendanceOptions} series={attendanceSeries} type="area" height={320} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Summary</h2>
          <Chart options={pieOptions} series={pieSeries} type="donut" height={320} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Salary Trend</h2>
          <Chart options={salaryOptions} series={salarySeries} type="area" height={320} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {data?.recentAttendance?.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800">Attendance ({item.status})</p>
                  <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                  {item.workingHours || 0}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="font-bold text-xl mb-4">Apply Leave</h2>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Leave Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="ANNUAL">Annual</option>
                <option value="SICK">Sick</option>
                <option value="CASUAL">Casual</option>
              </select>

              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                placeholder="Reason for leave..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border p-3 rounded-xl h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl font-semibold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-indigo-700 transition-all"
              >
                {submitLoading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-2xl text-white bg-linear-to-r ${color} shadow-lg hover:scale-105 transition duration-300`}>
    <p className="text-sm opacity-80 font-medium uppercase tracking-wider">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
  </div>
);

export default EmployeeDashboard;