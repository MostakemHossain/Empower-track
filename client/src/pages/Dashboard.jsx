import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import api from "../api/axios";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = data?.data?.role;

  useEffect(() => {
    api
      .get("/dashboard/get")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data", err);
        toast.error("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading/>
  }

  return role?.toLowerCase() === "admin" ? (
    <AdminDashboard data={data?.data} />
  ) : (
    <EmployeeDashboard data={data?.data} />
  );
};

export default Dashboard;