import Chart from "react-apexcharts";
import { dummyAdminDashboardData, dummyAttendanceData } from "../assets/assets";

const AdminDashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const attendanceSeries = [
    {
      name: "Working Hours",
      data: dummyAttendanceData?.map((d) => d.workingHours || 0) || [],
    },
  ];

  const attendanceOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "smooth" },
    xaxis: {
      categories:
        dummyAttendanceData?.map((d) =>
          new Date(d.date).toLocaleDateString()
        ) || [],
    },
    dataLabels: { enabled: false },
  };

  const pieSeries = [
    dummyAdminDashboardData?.todayAttendance || 0,
    dummyAdminDashboardData?.pendingLeaves || 0,
  ];

  const pieOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Present", "Leaves"],
    legend: { position: "bottom" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">{today}</p>
        </div>

        <div className="mt-4 md:mt-0 px-4 py-2 bg-white shadow rounded-xl text-sm text-gray-600">
          Welcome back 👋 Manage everything from here
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Employees"
          value={dummyAdminDashboardData.totalEmployees}
          color="from-indigo-500 to-indigo-600"
        />

        <StatCard
          title="Departments"
          value={dummyAdminDashboardData.totalDepartments}
          color="from-blue-500 to-blue-600"
        />

        <StatCard
          title="Today Attendance"
          value={dummyAdminDashboardData.todayAttendance}
          color="from-emerald-500 to-emerald-600"
        />

        <StatCard
          title="Pending Leaves"
          value={dummyAdminDashboardData.pendingLeaves}
          color="from-red-500 to-red-600"
        />
      </div>

      {/* ================= CHART SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Attendance Overview
          </h2>

          <Chart
            options={attendanceOptions}
            series={attendanceSeries}
            type="area"
            height={320}
          />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Today Summary
          </h2>

          <Chart
            options={pieOptions}
            series={pieSeries}
            type="donut"
            height={320}
          />
        </div>
      </div>

      {/* ================= ACTIVITY ================= */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-5">
          Recent Activity
        </h2>

        <div className="space-y-4">
          {dummyAttendanceData?.slice(0, 5).map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-gray-800">
                  Attendance marked ({item.status})
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                {item.workingHours || 0}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

/* ================= STATS CARD ================= */
const StatCard = ({ title, value, color }) => {
  return (
    <div
      className={`p-6 rounded-2xl text-white bg-gradient-to-r ${color}
      shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
};