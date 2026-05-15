import EmployeeCard from "./EmployeeCard";
import EmployeeSkeleton from "./EmployeeSkeleton";
import EmptyState from "./EmptyState";

const EmployeeGrid = ({
  loading,
  employees,
  visibleEmployees,
  setSelectedEmployee,
  setIsDetailOpen,
  setIsEditMode,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {loading &&
        Array.from({ length: 8 }).map((_, i) => (
          <EmployeeSkeleton key={i} />
        ))}

      {!loading && employees.length === 0 && (
        <EmptyState />
      )}

      {!loading &&
        employees
          .slice(0, visibleEmployees)
          .map((emp) => (
            <EmployeeCard
              key={emp._id}
              emp={emp}
              onView={() => {
                setSelectedEmployee(emp);
                setIsDetailOpen(true);
                setIsEditMode(false);
              }}
            />
          ))}
    </div>
  );
};

export default EmployeeGrid;