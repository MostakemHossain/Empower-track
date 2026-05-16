import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import AttendanceChart from "./AttendanceChart";
import SummaryChart from "./SummaryChart";
import LeaveModal from "./LeaveModal";

const EmployeeDashboard = ({ data, refreshData }) => {
  const [openModal, setOpenModal] = useState(false);

  const attendanceSeries = [
    {
      name: "Working Hours",
      data: data?.attendanceOverview?.map((d) => d.workingHours || 0) || [],
    },
  ];

  const attendanceOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth" },
    xaxis: {
      categories:
        data?.attendanceOverview?.map((d) =>
          new Date(d.date).toLocaleDateString()
        ) || [],
    },
  };

  const pieSeries = [
    data?.currentMonthAttendance || 0,
    data?.pendingLeaves || 0,
  ];

  const pieOptions = {
    chart: { type: "donut" },
    labels: ["Attendance", "Leaves"],
    legend: { position: "bottom" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <DashboardHeader
        data={data}
        openModal={openModal}
        setOpenModal={setOpenModal}
        refreshData={refreshData}
      />

      <DashboardStats data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <AttendanceChart data={attendanceSeries} options={attendanceOptions} />

        <SummaryChart data={pieSeries} options={pieOptions} />
      </div>

      <LeaveModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        refreshData={refreshData}
      />
    </div>
  );
};

export default EmployeeDashboard;
