import { useEffect, useState } from "react";
import { dummyEmployeeData, DEPARTMENTS } from "../assets/assets";
import AddEmployeeModal from "./AddEmployeeModal";

const Employees = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // ✅ IMPORTANT: use state data, NOT dummyEmployeeData directly
  const [employees, setEmployees] = useState(dummyEmployeeData);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // ✅ FIX: use employees (state), not dummyEmployeeData
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
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Employees
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage workforce efficiently • Total:{" "}
            <span className="font-semibold text-indigo-600">
              {filteredEmployees.length}
            </span>
          </p>
        </div>

        {/* ✅ FIX: add onClick */}
        <button
          onClick={() => setOpenModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg hover:scale-105 active:scale-95 transition"
        >
          + Add Employee
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm p-5 mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400/30 outline-none"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400/30 outline-none"
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        {/* TABS */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", "ACTIVE", "INACTIVE"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* LOADING */}
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="w-20 h-20 mx-auto bg-slate-200 rounded-full"></div>
              <div className="h-4 bg-slate-200 rounded mt-4 w-3/4 mx-auto"></div>
              <div className="h-3 bg-slate-200 rounded mt-2 w-1/2 mx-auto"></div>
              <div className="h-10 bg-slate-200 rounded mt-6"></div>
            </div>
          ))}

        {/* DATA */}
        {!loading &&
          (filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => {
              const fullName = `${emp.firstName} ${emp.lastName}`;
              const netSalary =
                emp.basicSalary + emp.allowances - emp.deductions;

              const isActive = emp.employmentStatus === "ACTIVE";

              return (
                <div
                  key={emp._id}
                  className="group bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* AVATAR */}
                  <div className="flex justify-center">
                    {emp.image ? (
                      <img
                        src={emp.image}
                        alt={fullName}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-indigo-500 to-violet-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                        {emp.firstName[0]}
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="text-center mt-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {fullName}
                    </h2>
                    <p className="text-sm text-slate-500">{emp.position}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {emp.department}
                    </p>
                  </div>

                  {/* SALARY */}
                  <div className="mt-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 p-3 text-center">
                    <p className="text-sm font-semibold text-slate-800">
                      ${netSalary.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">Net Salary</p>
                  </div>

                  {/* STATUS */}
                  <div className="mt-4 flex justify-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full
                        ${
                          isActive
                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                            : "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                        }`}
                    >
                      {emp.employmentStatus}
                    </span>
                  </div>

                  {/* BUTTON */}
                  <button className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:opacity-90 active:scale-95 transition">
                    View Profile
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-slate-500">
              No employees found
            </div>
          ))}
      </div>

      {/* MODAL */}
      <AddEmployeeModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={(emp) => {
          setEmployees((prev) => [emp, ...prev]); // ✅ WORKS NOW
        }}
      />
    </div>
  );
};

export default Employees;