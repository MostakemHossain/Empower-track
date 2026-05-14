const AttendanceStats = ({ totals, attendanceRecords }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
      <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-500 to-teal-500 text-white">
        <p className="text-xs uppercase tracking-widest opacity-80">
          Present
        </p>
        <h2 className="text-3xl font-black mt-2">{totals.present}</h2>
      </div>

      <div className="p-6 rounded-3xl bg-linear-to-r from-rose-500 to-pink-500 text-white">
        <p className="text-xs uppercase tracking-widest opacity-80">Absent</p>
        <h2 className="text-3xl font-black mt-2">{totals.absent}</h2>
      </div>

      <div className="p-6 rounded-3xl bg-linear-to-r from-indigo-500 to-blue-500 text-white">
        <p className="text-xs uppercase tracking-widest opacity-80">
          Avg Hours
        </p>
        <h2 className="text-3xl font-black mt-2">{totals.avgHours}</h2>
      </div>

      <div className="p-6 rounded-3xl bg-linear-to-r from-amber-500 to-orange-500 text-white">
        <p className="text-xs uppercase tracking-widest opacity-80">
          Records
        </p>
        <h2 className="text-3xl font-black mt-2">
          {attendanceRecords.length}
        </h2>
      </div>
    </div>
  );
};

export default AttendanceStats;