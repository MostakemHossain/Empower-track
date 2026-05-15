import LeaveTableRow from "./LeaveTableRow";
import LeaveTableSkeleton from "./LeaveTableSkeleton";
import EmptyState from "./EmptyState";

const LeaveTable = ({
  role,
  leaves,
  loading,
  actionLoading,
  handleAction,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-3xl shadow">
      <table className="w-full min-w-300">
        <thead className="bg-slate-100 text-xs uppercase text-slate-500">
          <tr>
            <th className="text-left px-8 py-5">#</th>
            <th className="text-left px-8 py-5">
              Employee
            </th>
            <th className="text-left px-8 py-5">
              Employee Name
            </th>
            <th className="text-left px-8 py-5">
              Employee ID
            </th>
            <th className="text-left px-8 py-5">
              Phone Number
            </th>
            <th className="text-left px-8 py-5">
              Department
            </th>
            <th className="text-left px-8 py-5">
              Position
            </th>
            <th className="text-left px-8 py-5">
              Type
            </th>
            <th className="text-left px-8 py-5">
              Duration
            </th>
            <th className="text-left px-8 py-5">
              Reason
            </th>
            <th className="text-left px-8 py-5">
              Applied
            </th>
            <th className="text-left px-8 py-5">
              Status
            </th>

            {role === "admin" && (
              <th className="text-right px-8 py-5">
                Action
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <LeaveTableSkeleton key={i} />
            ))
          ) : leaves.length === 0 ? (
            <EmptyState />
          ) : (
            leaves.map((leave, index) => (
              <LeaveTableRow
                key={leave._id}
                leave={leave}
                index={index}
                role={role}
                actionLoading={actionLoading}
                handleAction={handleAction}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;