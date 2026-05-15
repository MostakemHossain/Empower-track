const LeaveHeader = ({
    role,
    setOpenModal,
  }) => {
    return (
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
    );
  };
  
  export default LeaveHeader;