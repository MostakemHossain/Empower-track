import { useEffect, useState } from "react";
import { dummyEmployeeData, DEPARTMENTS } from "../assets/assets";
import AddEmployeeModal from "./AddEmployeeModal";
import EmployeeDetailModal from "./EmployeeDetailModal";

const Employees = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const [employees, setEmployees] = useState(dummyEmployeeData);
  const [openModal, setOpenModal] = useState(false);

  // ✅ detail & edit modal state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();

    const matchSearch = fullName.includes(search.toLowerCase());
    const matchDept = department === "ALL" || emp.department === department;
    const matchTab = activeTab === "ALL" || emp.employmentStatus === activeTab;

    return matchSearch && matchDept && matchTab;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 md:px-10 py-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Employees
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Total:{" "}
            <span className="font-semibold text-indigo-600">
              {filteredEmployees.length}
            </span>
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium"
        >
          + Add Employee
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-2xl p-5 mb-8 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-xl"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border rounded-xl"
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <div className="flex gap-2 flex-wrap">
          {["ALL", "ACTIVE", "INACTIVE"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-white border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-5 rounded-2xl">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-4 bg-gray-200 mt-4 w-3/4 mx-auto"></div>
            </div>
          ))}

        {!loading &&
          filteredEmployees.map((emp) => {
            const fullName = `${emp.firstName} ${emp.lastName}`;
            const netSalary =
              emp.basicSalary + emp.allowances - emp.deductions;

            return (
              <div
                key={emp._id}
                className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition"
              >
                {/* AVATAR */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
                    {emp.firstName[0]}
                  </div>
                </div>

                {/* INFO */}
                <div className="text-center mt-3">
                  <h2 className="font-semibold">{fullName}</h2>
                  <p className="text-sm text-gray-500">{emp.position}</p>
                </div>

                {/* SALARY */}
                <div className="text-center mt-3 text-sm">
                  Net: ${netSalary}
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setIsDetailOpen(true);
                    setIsEditMode(false);
                  }}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl"
                >
                  View Profile
                </button>
              </div>
            );
          })}
      </div>

      {/* ADD MODAL */}
      <AddEmployeeModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={(emp) =>
          setEmployees((prev) => [emp, ...prev])
        }
      />

      {/* DETAIL + EDIT MODAL */}
      <EmployeeDetailModal
        isOpen={isDetailOpen}
        employee={selectedEmployee}
        mode={isEditMode ? "edit" : "view"}
        onClose={() => setIsDetailOpen(false)}
        onSave={(updatedEmp) => {
          setEmployees((prev) =>
            prev.map((e) =>
              e._id === updatedEmp._id ? updatedEmp : e
            )
          );
        }}
        onEdit={() => setIsEditMode(true)}
      />
    </div>
  );
};

export default Employees;