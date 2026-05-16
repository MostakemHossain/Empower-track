import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const LeaveModal = ({ openModal, setOpenModal, refreshData }) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form, setForm] = useState({
    type: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  if (!openModal) return null;

  const handleSubmit = async () => {
    try {
      if (!form.startDate || !form.endDate || !form.reason) {
        return toast.error("Please fill all fields");
      }

      setSubmitLoading(true);

      await api.post("/leave/create-leave", form);

      toast.success("Leave applied successfully");

      setForm({ type: "ANNUAL", startDate: "", endDate: "", reason: "" });

      setOpenModal(false);

      refreshData?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">

        <h2 className="font-bold text-xl mb-4">Apply Leave</h2>

        <div className="space-y-3">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
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
              setForm({ ...form, startDate: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
            }
            className="w-full border p-3 rounded-xl h-24"
            placeholder="Reason"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setOpenModal(false)}
            className="px-4 py-2 bg-slate-100 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;