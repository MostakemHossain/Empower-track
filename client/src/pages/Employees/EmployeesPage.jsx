

import AddEmployeeModal from "./components/AddEmployeeModal";
import EmployeeDetailModal from "../EmployeeDetailModal";
import { useEmployees } from "./hooks/useEmployees";
import EmployeesHeader from "./components/EmployeesHeader"
import EmployeeFilters from "./components/EmployeeFilters";
import EmployeeGrid from "./components/EmployeeGrid";


import LoadMoreButton from "./components/LoadMoreButton";
const EmployeesPage = () => {
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    department,
    setDepartment,

    loading,
    employees,
    visibleEmployees,
    setVisibleEmployees,

    openModal,
    setOpenModal,

    selectedEmployee,
    setSelectedEmployee,

    isDetailOpen,
    setIsDetailOpen,

    isEditMode,
    setIsEditMode,

    fetchEmployees,
    setEmployees,
  } = useEmployees();

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 via-white to-indigo-50 px-4 md:px-10 py-6">
      {/* HEADER */}
      <EmployeesHeader employees={employees} onAdd={() => setOpenModal(true)} />

      {/* FILTERS */}
      <EmployeeFilters
        search={search}
        setSearch={setSearch}
        department={department}
        setDepartment={setDepartment}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* GRID */}
      <EmployeeGrid
        loading={loading}
        employees={employees}
        visibleEmployees={visibleEmployees}
        setSelectedEmployee={setSelectedEmployee}
        setIsDetailOpen={setIsDetailOpen}
        setIsEditMode={setIsEditMode}
      />

      {/* LOAD MORE */}
      <LoadMoreButton
        loading={loading}
        employees={employees}
        visibleEmployees={visibleEmployees}
        onLoadMore={() => setVisibleEmployees((prev) => prev + 8)}
      />

      {/* ADD MODAL */}
      <AddEmployeeModal
        fetchEmployees={fetchEmployees}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={(emp) => setEmployees((prev) => [emp, ...prev])}
      />

      {/* DETAIL MODAL */}
      <EmployeeDetailModal
        isOpen={isDetailOpen}
        employee={selectedEmployee}
        mode={isEditMode ? "edit" : "view"}
        onClose={() => setIsDetailOpen(false)}
        onSave={(updatedEmp) => {
          setEmployees((prev) =>
            prev.map((e) => (e._id === updatedEmp._id ? updatedEmp : e))
          );
        }}
        onEdit={() => setIsEditMode(true)}
      />
    </div>
  );
};

export default EmployeesPage;
