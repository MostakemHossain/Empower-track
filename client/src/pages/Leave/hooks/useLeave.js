import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

export const useLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState("");

  const [form, setForm] = useState({
    type: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const fetchLeave = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/leave/get-leaves");

      setLeaves(res?.data?.data?.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeave();
  }, [fetchLeave]);

  const handleAction = async (id, status) => {
    try {
      setActionLoading(id);

      await api.put(`/leave/update-leave-status/${id}`, {
        status,
      });

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === id ? { ...l, status } : l
        )
      );

      toast.success(`Leave ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update leave");
    } finally {
      setActionLoading("");
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        !form.startDate ||
        !form.endDate ||
        !form.reason
      ) {
        return toast.error("Please fill all fields");
      }

      setSubmitLoading(true);

      await api.post("/leave/create-leave", form);

      toast.success("Leave applied successfully");

      setOpenModal(false);

      setForm({
        type: "ANNUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });

      fetchLeave();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to apply leave"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: leaves.length,
      pending: leaves.filter(
        (l) => l.status === "PENDING"
      ).length,

      approved: leaves.filter(
        (l) => l.status === "APPROVED"
      ).length,

      rejected: leaves.filter(
        (l) => l.status === "REJECTED"
      ).length,
    };
  }, [leaves]);

  return {
    leaves,
    loading,
    openModal,
    setOpenModal,
    submitLoading,
    actionLoading,
    form,
    setForm,
    handleSubmit,
    handleAction,
    stats,
  };
};