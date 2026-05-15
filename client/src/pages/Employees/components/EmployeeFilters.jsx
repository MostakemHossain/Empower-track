import { DEPARTMENTS } from "../../../assets/assets";

const EmployeeFilters = ({
  search,
  setSearch,
  department,
  setDepartment,
  activeTab,
  setActiveTab,
}) => {
  return (
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
        <option value="ALL">
          All Departments
        </option>

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
  );
};

export default EmployeeFilters;