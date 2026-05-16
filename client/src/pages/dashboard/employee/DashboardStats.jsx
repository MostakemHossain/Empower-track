import StatCard from "../../../components/StarCard";

const DashboardStats = ({ data }) => {
  const totalHours =
    data?.attendanceOverview
      ?.reduce((acc, cur) => acc + (cur.workingHours || 0), 0)
      .toFixed(1) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Attendance"
        value={data?.currentMonthAttendance || 0}
        color="from-indigo-500 to-indigo-600"
      />

      <StatCard
        title="Pending Leaves"
        value={data?.pendingLeaves || 0}
        color="from-red-500 to-red-600"
      />

      <StatCard
        title="Latest Salary"
        value={`$${data?.latestPayslip?.netSalary || 0}`}
        color="from-emerald-500 to-emerald-600"
      />

      <StatCard
        title="Total Hours"
        value={totalHours}
        color="from-blue-500 to-blue-600"
      />
    </div>
  );
};

export default DashboardStats;