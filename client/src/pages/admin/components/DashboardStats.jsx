import StatCard from "../../../components/StarCard";


const DashboardStats = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Employees"
        value={data?.totalEmployees || 0}
        color="from-indigo-500 to-indigo-600"
      />

      <StatCard
        title="Departments"
        value={data?.totalDepartments || 0}
        color="from-blue-500 to-blue-600"
      />

      <StatCard
        title="Today's Attendance"
        value={data?.todayAttendance || 0}
        color="from-emerald-500 to-emerald-600"
      />

      <StatCard
        title="Pending Leaves"
        value={data?.pendingLeaves || 0}
        color="from-red-500 to-red-600"
      />
    </div>
  );
};

export default DashboardStats;