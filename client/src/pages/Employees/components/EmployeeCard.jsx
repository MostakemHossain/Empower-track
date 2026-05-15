const EmployeeCard = ({ emp, onView }) => {
    const fullName = `${emp.firstName} ${emp.lastName}`;
  
    const netSalary =
      (emp.baseSalary || 0) +
      (emp.allowances || 0) -
      (emp.deductions || 0);
  
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition duration-300">
  
        <div className="flex justify-center">
          {emp?.photo ? (
            <img
              src={emp.photo}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
              {emp?.firstName?.charAt(0)}
            </div>
          )}
        </div>
  
        <div className="text-center mt-4">
          <h2 className="font-semibold text-slate-800">
            {fullName}
          </h2>
  
          <p className="text-sm text-gray-500">
            {emp.position}
          </p>
  
          <p className="text-xs mt-1 text-indigo-600 font-medium">
            {emp.department}
          </p>
        </div>
  
        <div className="text-center mt-4 text-sm font-medium text-gray-700">
          Net Salary: ৳
          {netSalary.toLocaleString()}
        </div>
  
        <div className="flex justify-center mt-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              emp.employmentStatus === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {emp.employeeId}
          </span>
        </div>
  
        <button
          onClick={onView}
          className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition"
        >
          View Profile
        </button>
      </div>
    );
  };
  
  export default EmployeeCard;