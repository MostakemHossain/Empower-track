const EmployeesHeader = ({ employees, onAdd }) => {
    return (
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Employees
          </h1>
  
          <p className="text-sm text-slate-500 mt-1">
            Total:{" "}
            <span className="font-semibold text-indigo-600">
              {employees.length}
            </span>
          </p>
        </div>
  
        <button
          onClick={onAdd}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Employee
        </button>
      </div>
    );
  };
  
  export default EmployeesHeader;