import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const role = "e"; 

  return role === "admin"
    ? <AdminDashboard />
    : <EmployeeDashboard />;
};

export default Dashboard;