import { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import AddEmployeeModal from "./AddEmployeeModal";
import EmployeeDetailModal from "./EmployeeDetailModal";
import toast from "react-hot-toast";
import api from "../api/axios";

const Employees = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [visibleEmployees, setVisibleEmployees] = useState(8);

  const [openModal, setOpenModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ================= FETCH EMPLOYEES =================
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search);
      if (department !== "ALL")
        params.append("department", department);
      if (activeTab !== "ALL")
        params.append("status", activeTab);

      const res = await api.get(
        `/employee/get-all-employees?${params.toString()}`
      );

      setEmployees(res?.data?.data?.data || []);
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  }, [search, department, activeTab]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Reset load more on filter change
  useEffect(() => {
    setVisibleEmployees(8);
  }, [search, department, activeTab]);

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
              {employees.length}
            </span>
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Employee
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl p-5 mb-8 flex flex-col md:flex-row gap-4 shadow-sm">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
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
              className={`px-4 py-2 rounded-xl text-sm transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* EMPLOYEE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* LOADING */}
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-5 rounded-2xl shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-4 bg-gray-200 mt-4 w-3/4 mx-auto rounded"></div>
              <div className="h-3 bg-gray-200 mt-2 w-1/2 mx-auto rounded"></div>
              <div className="h-3 bg-gray-200 mt-3 w-1/3 mx-auto rounded"></div>
              <div className="h-10 bg-gray-200 mt-5 rounded-xl"></div>
              <div className="h-6 bg-gray-200 mt-4 w-1/3 mx-auto rounded-full"></div>
              <div className="h-10 bg-gray-200 mt-5 rounded-xl"></div>
            </div>
          ))}

        {/* EMPTY */}
        {!loading && employees.length === 0 && (
          <div className="col-span-full text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700">
              No Employees Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing filters or search keyword.
            </p>
          </div>
        )}

        {/* EMPLOYEES */}
        {!loading &&
          employees
            .slice(0, visibleEmployees)
            .map((emp) => {
              const fullName = `${emp.firstName} ${emp.lastName}`;

              const netSalary =
                (emp.baseSalary || 0) +
                (emp.allowances || 0) -
                (emp.deductions || 0);

              return (
                <div
                  key={emp._id}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition duration-300"
                >
                  {/* AVATAR */}
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

                  {/* INFO */}
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

                  {/* SALARY */}
                  <div className="text-center mt-4 text-sm font-medium text-gray-700">
                    Net Salary: ৳
                    {netSalary.toLocaleString()}
                  </div>

                  {/* STATUS */}
                  <div className="flex justify-center mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emp.employmentStatus === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {emp.employmentStatus}
                    </span>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setIsDetailOpen(true);
                      setIsEditMode(false);
                    }}
                    className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition"
                  >
                    View Profile
                  </button>
                </div>
              );
            })}
      </div>

      {/* LOAD MORE */}
      {!loading &&
        employees.length > visibleEmployees && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() =>
                setVisibleEmployees(
                  (prev) => prev + 8
                )
              }
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
            >
              Load More
            </button>
          </div>
        )}

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
              e._id === updatedEmp._id
                ? updatedEmp
                : e
            )
          );
        }}
        onEdit={() => setIsEditMode(true)}
      />
    </div>
  );
};

export default Employees;