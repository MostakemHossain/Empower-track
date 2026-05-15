import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

export const useEmployees = () => {
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

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search);
      }

      if (department !== "ALL") {
        params.append("department", department);
      }

      if (activeTab !== "ALL") {
        params.append("status", activeTab);
      }

      const res = await api.get(
        `/employee/get-all-employees?${params.toString()}`
      );

      setEmployees(res?.data?.data?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [search, department, activeTab]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    setVisibleEmployees(8);
  }, [search, department, activeTab]);

  return {
    activeTab,
    setActiveTab,

    search,
    setSearch,

    department,
    setDepartment,

    loading,
    employees,
    setEmployees,

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
  };
};
