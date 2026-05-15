import StatCard from "../../../components/StarCard";

const AttendanceStats = ({ totals, attendanceRecords }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
      <StatCard
        title="Present"
        value={totals.present}
        color="from-indigo-600 to-blue-500"
      />

      <StatCard
        title="Absent"
        value={`${totals.absent}`}
        color="from-rose-500 to-pink-500"
      />

      <StatCard
        title="Avg Hours"
        value={`${totals.avgHours}`}
        color="from-indigo-500 to-blue-500"
      />
      <StatCard
        title="Records"
        value={`${attendanceRecords.length}`}
        color="from-amber-500 to-orange-500"
      />
    </div>
  );
};

export default AttendanceStats;
