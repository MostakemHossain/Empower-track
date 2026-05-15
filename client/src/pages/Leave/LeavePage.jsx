import LeaveHeader from "./components/LeaveHeader";
import LeaveStats from "./components/LeaveStats";
import LeaveTable from "./components/LeaveTable";
import LeaveModal from "./components/LeaveModal";

import { useAuth } from "../../context/AuthContext";
import { useLeave } from "./hooks/useLeave";

const LeavePage = () => {
  const { user } = useAuth();

  const {
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
  } = useLeave();

  const role = user?.role?.toLowerCase();

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      <LeaveHeader
        role={role}
        setOpenModal={setOpenModal}
      />

      <LeaveStats stats={stats} />

      <LeaveTable
        role={role}
        leaves={leaves}
        loading={loading}
        actionLoading={actionLoading}
        handleAction={handleAction}
      />

      <LeaveModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        submitLoading={submitLoading}
      />
    </div>
  );
};

export default LeavePage;