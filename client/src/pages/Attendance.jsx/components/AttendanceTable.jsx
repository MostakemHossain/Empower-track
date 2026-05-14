import AttendanceSkeleton from "./AttendanceSkeleton";

const AttendanceTable = ({ user, records, loading }) => {
  return (
    <div className="bg-white rounded-4xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-300 border-separate border-spacing-0">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
            <tr>
              <th className="px-8 py-5 text-left">#</th>

              {user?.role === "ADMIN" && (
                <>
                  <th className="px-8 py-5 text-left">Employee</th>
                  <th className="px-8 py-5 text-left">ID</th>
                </>
              )}

              <th className="px-8 py-5 text-left">Date</th>
              <th className="px-8 py-5 text-left">Check In</th>
              <th className="px-8 py-5 text-left">Check Out</th>
              <th className="px-8 py-5 text-left">Hours</th>
              <th className="px-8 py-5 text-left">Type</th>
              <th className="px-8 py-5 text-right">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm text-slate-700">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <AttendanceSkeleton key={i} user={user} />
                ))
              : records.map((r, i) => (
                  <tr
                    key={r._id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-8 py-5 font-semibold text-slate-400">
                      {i + 1}
                    </td>

                    {user?.role === "ADMIN" && (
                      <>
                        <td className="px-8 py-5 font-medium text-slate-800">
                          {r.employee?.firstName} {r.employee?.lastName}
                        </td>
                        <td className="px-8 py-5 text-slate-500">
                          {r.employee?.employeeId}
                        </td>
                      </>
                    )}

                    <td className="px-8 py-5">
                      {new Date(r.date).toLocaleDateString()}
                    </td>

                    <td className="px-8 py-5">
                      {r.checkIn
                        ? new Date(r.checkIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                    </td>

                    <td className="px-8 py-5">
                      {r.checkOut
                        ? new Date(r.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                    </td>

                    <td className="px-8 py-5 font-semibold text-indigo-600">
                      {r.workingHours ? `${r.workingHours} hrs` : "--"}
                    </td>

                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        {r.dayType || "N/A"}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${
                          r.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-700"
                            : r.status === "LATE"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
