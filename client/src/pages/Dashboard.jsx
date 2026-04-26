import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const role = "employee"; 

  return role === "admin"
    ? <AdminDashboard />
    : <EmployeeDashboard />;
};

export default Dashboard;