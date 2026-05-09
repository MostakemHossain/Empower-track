import React, { useState, useEffect, useCallback } from "react";
import { Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const { user } = useAuth();

  const [form, setForm] = useState({
    type: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const role = user?.role?.toLowerCase();

  /* ================= FETCH LEAVES ================= */

  const fetchLeave = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/leave/get-leaves");

      setLeaves(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch leaves", error);
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeave();
  }, [fetchLeave]);

  /* ================= STATS ================= */

  const totalLeaves = leaves.length;

  const pendingLeaves = leaves.filter((l) => l.status === "PENDING").length;

  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED").length;
  const rejectedLeaves = leaves.filter((l) => l.status === "REJECTED").length;

  /* ================= HANDLE ACTION ================= */

  const handleAction = async (id, status) => {
    try {
      setActionLoading(id);

      await api.put(`/leave/update-leave-status/${id}`, {
        status,
      });

      setLeaves((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status } : l))
      );

      toast.success(`Leave ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update leave");
    } finally {
      setActionLoading("");
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      if (!form.startDate || !form.endDate || !form.reason) {
        return toast.error("Please fill all fields");
      }

      setSubmitLoading(true); // ✅ start loading

      await api.post("/leave/create-leave", {
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });

      toast.success("Leave applied successfully");

      setOpenModal(false);

      setForm({
        type: "ANNUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });

      await fetchLeave();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to apply leave");
    } finally {
      setSubmitLoading(false); // ✅ stop loading
    }
  };

  /* ================= STATUS STYLE ================= */

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
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800">
            Leave Management
          </h1>

          <p className="text-slate-500 font-medium">
            Manage employee leave requests
          </p>
        </div>

        {role === "employee" && (
          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow hover:bg-indigo-700"
          >
            + Apply Leave
          </button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-linear-to-r from-indigo-500 to-blue-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Total Leaves
          </p>

          <h2 className="text-3xl font-black mt-2">{totalLeaves}</h2>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Pending
          </p>

          <h2 className="text-3xl font-black mt-2">{pendingLeaves}</h2>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Approved
          </p>

          <h2 className="text-3xl font-black mt-2">{approvedLeaves}</h2>
        </div>
        <div className="p-6 rounded-3xl bg-linear-to-r from-red-500 to-yellow-300 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Rejected
          </p>

          <h2 className="text-3xl font-black mt-2">{rejectedLeaves}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-3xl shadow">
        <table className="w-full min-w-300">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="text-left px-8 py-5">#</th>
              <th className="text-left px-8 py-5">Employee</th>

              <th className="text-left px-8 py-5">Employee Name</th>
              <th className="text-left px-8 py-5">Employee ID</th>
              <th className="text-left px-8 py-5">Phone Number</th>

              <th className="text-left px-8 py-5">Department</th>

              <th className="text-left px-8 py-5">Position</th>

              <th className="text-left px-8 py-5">Type</th>

              <th className="text-left px-8 py-5">Duration</th>

              <th className="text-left px-8 py-5">Reason</th>

              <th className="text-left px-8 py-5">Applied</th>

              <th className="text-left px-8 py-5">Status</th>

              {role === "admin" && (
                <th className="text-right px-8 py-5">Action</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="11" className="px-8 py-6">
                    <div className="h-12 bg-slate-100 animate-pulse rounded-xl"></div>
                  </td>
                </tr>
              ))
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-10 text-slate-400">
                  No leave requests
                </td>
              </tr>
            ) : (
              leaves.map((leave, index) => (
                <tr
                  key={leave._id}
                  className="hover:bg-indigo-50/40 transition"
                >
                  {/* SERIAL */}
                  <td className="px-8 py-5 font-bold text-slate-700">
                    {index + 1}
                  </td>

                  {/* EMPLOYEE */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          leave.employee?.photo ||
                          "https://ui-avatars.com/api/?name=User"
                        }
                        alt="employee"
                        className="w-11 h-11 rounded-2xl object-cover border"
                      />
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-600 font-semibold">
                    <h3 className="font-bold text-slate-800 leading-none">
                      {leave.employee?.firstName}{" "}
                    </h3>
                  </td>

                  {/* EMPLOYEE ID */}
                  <td className="px-2 py-5 text-slate-600 font-semibold">
                    {leave.employee?.employeeId || "N/A"}
                  </td>
                  <td className="px-8 py-5 text-slate-600 font-semibold">
                    <p className="text-xs text-slate-500 mt-1">
                      {leave.employee?.phone}
                    </p>
                  </td>

                  {/* DEPARTMENT */}
                  <td className="px-8 py-5 text-slate-600 font-semibold">
                    {leave.employee?.department || "N/A"}
                  </td>

                  {/* POSITION */}
                  <td className="px-8 py-5 text-slate-600 font-semibold">
                    {leave.employee?.position || "N/A"}
                  </td>

                  {/* TYPE */}
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full text-xs bg-slate-100 font-bold">
                      {leave.type}
                    </span>
                  </td>

                  {/* DURATION */}
                  <td className="px-8 py-5 text-slate-600 font-semibold whitespace-nowrap">
                    {new Date(leave.startDate).toLocaleDateString()} →{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>

                  {/* REASON */}
                  <td className="px-8 py-5 text-slate-500 max-w-xs truncate">
                    {leave.reason}
                  </td>

                  {/* APPLIED DATE */}
                  <td className="px-8 py-5 text-slate-500 font-medium whitespace-nowrap">
                    {new Date(leave.createdAt).toLocaleDateString()}
                  </td>

                  {/* STATUS */}
                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${getStatusStyle(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  {role === "admin" && (
                    <td className="px-8 py-5 text-right">
                      {leave.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={actionLoading === leave._id}
                            onClick={() => handleAction(leave._id, "APPROVED")}
                            className="p-2 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 disabled:opacity-50"
                          >
                            <Check size={18} />
                          </button>

                          <button
                            disabled={actionLoading === leave._id}
                            onClick={() => handleAction(leave._id, "REJECTED")}
                            className="p-2 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-200 disabled:opacity-50"
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="font-bold text-xl mb-4">Apply Leave</h2>

            <div className="space-y-3">
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
              >
                <option value="ANNUAL">Annual</option>
                <option value="SICK">Sick</option>
                <option value="CASUAL">Casual</option>
              </select>

              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
              />

              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
              />

              <textarea
                placeholder="Reason"
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
