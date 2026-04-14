import Chart from "react-apexcharts";
import {
  dummyEmployeeDashboardData,
  dummyPayslipData,
  dummyAttendanceData,
} from "../assets/assets";

const EmployeeDashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* ================= SAFE DATA ================= */

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
    dataLabels: { enabled: false },
    xaxis: {
      categories:
        dummyAttendanceData?.map((d) =>
          new Date(d.date).toLocaleDateString()
        ) || [],
    },
  };

  const salarySeries = [
    {
      name: "Net Salary",
      data: dummyPayslipData?.map((d) => d.netSalary || 0) || [],
    },
  ];

  const salaryOptions = {
     colors: ["#10B981"],
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    xaxis: {
      categories:
        dummyPayslipData?.map((d) => `${d.month}/${d.year}`) || [],
    },
  };

  const pieSeries = [
    dummyEmployeeDashboardData?.currentMonthAttendance || 0,
    dummyEmployeeDashboardData?.pendingLeaves || 0,
  ];

  const pieOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Attendance", "Leaves"],
    legend: { position: "bottom" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

{/* PROFILE */}
<div className="flex items-center gap-4">
  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
    {dummyEmployeeDashboardData.employee.firstName[0]}
  </div>

  <div className="min-w-0">
    <h2 className="font-semibold text-gray-800 truncate">
      {dummyEmployeeDashboardData.employee.firstName}{" "}
      {dummyEmployeeDashboardData.employee.lastName}
    </h2>
    <p className="text-sm text-gray-500 truncate">
      {dummyEmployeeDashboardData.employee.position}
    </p>
    <p className="text-xs text-gray-400">{today}</p>
  </div>
</div>

{/* ACTION BUTTONS */}
<div className="flex flex-wrap gap-3">
  <button
    onClick={() => alert("Attendance Marked")}
    className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-indigo-600 shadow hover:scale-105 transition"
  >
    Mark Attendance
  </button>

  <button
    onClick={() => alert("Leave Applied")}
    className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow hover:scale-105 transition"
  >
    Apply Leave
  </button>
</div>
</div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Attendance"
          value={dummyEmployeeDashboardData.currentMonthAttendance}
          color="from-indigo-500 to-indigo-600"
        />

        <StatCard
          title="Pending Leaves"
          value={dummyEmployeeDashboardData.pendingLeaves}
          color="from-red-500 to-red-600"
        />

        <StatCard
          title="Latest Salary"
          value={`$${dummyEmployeeDashboardData.latestPayslip.netSalary}`}
          color="from-emerald-500 to-emerald-600"
        />

        <StatCard
          title="Working Hours"
          value={
            dummyAttendanceData?.reduce(
              (acc, cur) => acc + (cur.workingHours || 0),
              0
            )
          }
          color="from-blue-500 to-blue-600"
        />
      </div>

      {/* ================= CHART SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            My Attendance Overview
          </h2>

          <Chart
            options={attendanceOptions}
            series={attendanceSeries}
            type="area"
            height={320}
            width={600}
          />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Monthly Summary
          </h2>

          <Chart
            options={pieOptions}
            series={pieSeries}
            type="donut"
            height={320}
          />
        </div>
      </div>

     <div className="flex justify-between">
         {/* ================= SALARY CHART ================= */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Salary Trend
        </h2>

        <Chart
          options={salaryOptions}
          series={salarySeries}
          type="area"
          height={320}
          width={600}
        />
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
                    Attendance ({item.status})
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
    </div>
  );
};

export default EmployeeDashboard;

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