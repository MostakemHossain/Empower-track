import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import AttendanceChart from "./components/AttendanceChart";
import SummaryChart from "./components/SummaryChart";
import RecentActivity from "./components/RecentActivity";

const AdminDashboard = ({ data }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">
      <DashboardHeader />

      <DashboardStats data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <AttendanceChart data={data} />
        <SummaryChart data={data} />
      </div>

      <RecentActivity data={data} />
    </div>
  );
};

export default AdminDashboard;