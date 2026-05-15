import { Check, X } from "lucide-react";

const LeaveTableRow = ({
  leave,
  index,
  role,
  actionLoading,
  handleAction,
}) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700";

      case "REJECTED":
        return "bg-rose-100 text-rose-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <tr className="hover:bg-indigo-50/40 transition">
      <td className="px-8 py-5 font-bold text-slate-700">
        {index + 1}
      </td>

      <td className="px-8 py-5">
        <img
          src={
            leave.employee?.photo ||
            "https://ui-avatars.com/api/?name=User"
          }
          alt="employee"
          className="w-11 h-11 rounded-2xl object-cover border"
        />
      </td>

      <td className="px-8 py-5 text-slate-600 font-semibold">
        <h3 className="font-bold text-slate-800 leading-none">
          {leave.employee?.firstName}
        </h3>
      </td>

      <td className="px-2 py-5 text-slate-600 font-semibold">
        {leave.employee?.employeeId || "N/A"}
      </td>

      <td className="px-8 py-5 text-slate-600 font-semibold">
        {leave.employee?.phone}
      </td>

      <td className="px-8 py-5 text-slate-600 font-semibold">
        {leave.employee?.department || "N/A"}
      </td>

      <td className="px-8 py-5 text-slate-600 font-semibold">
        {leave.employee?.position || "N/A"}
      </td>

      <td className="px-8 py-5">
        <span className="px-3 py-1 rounded-full text-xs bg-slate-100 font-bold">
          {leave.type}
        </span>
      </td>

      <td className="px-8 py-5 text-slate-600 font-semibold whitespace-nowrap">
        {new Date(
          leave.startDate
        ).toLocaleDateString()}{" "}
        →{" "}
        {new Date(
          leave.endDate
        ).toLocaleDateString()}
      </td>

      <td className="px-8 py-5 text-slate-500 max-w-xs truncate">
        {leave.reason}
      </td>

      <td className="px-8 py-5 text-slate-500 font-medium whitespace-nowrap">
        {new Date(
          leave.createdAt
        ).toLocaleDateString()}
      </td>

      <td className="px-8 py-5">
        <span
          className={`px-3 py-1 rounded-full text-xs font-black ${getStatusStyle(
            leave.status
          )}`}
        >
          {leave.status}
        </span>
      </td>

      {role === "admin" && (
        <td className="px-8 py-5 text-right">
          {leave.status === "PENDING" ? (
            <div className="flex justify-end gap-2">
              <button
                disabled={actionLoading === leave._id}
                onClick={() =>
                  handleAction(
                    leave._id,
                    "APPROVED"
                  )
                }
                className="p-2 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              >
                <Check size={18} />
              </button>

              <button
                disabled={actionLoading === leave._id}
                onClick={() =>
                  handleAction(
                    leave._id,
                    "REJECTED"
                  )
                }
                className="p-2 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-200"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              No Action
            </span>
          )}
        </td>
      )}
    </tr>
  );
};

export default LeaveTableRow;