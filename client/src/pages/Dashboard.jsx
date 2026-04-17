import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const role = "admin"; 

  return role === "admin"
    ? <AdminDashboard />
    : <EmployeeDashboard />;
};

export default Dashboard;