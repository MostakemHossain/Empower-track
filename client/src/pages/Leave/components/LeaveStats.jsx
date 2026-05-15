import StatCard from "../../../components/StarCard";

const LeaveStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
      <StatCard
        title="Total Leaves"
        value={stats.total}
        color="from-indigo-600 to-blue-500"
      />

      <StatCard
        title="Pending"
        value={stats.pending}
        color="from-rose-500 to-pink-500"
      />

      <StatCard
        title="Approved"
        value={stats.approved}
        color="from-indigo-500 to-blue-500"
      />

      <StatCard
        title="Rejected"
        value={stats.rejected}
        color="from-amber-500 to-orange-500"
      />
    </div>
  );
};

export default LeaveStats;