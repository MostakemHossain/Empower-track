const DashboardHeader = () => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
  
          <p className="text-gray-500 mt-1">{today}</p>
        </div>
  
        <div className="mt-4 md:mt-0 px-4 py-2 bg-white shadow-sm border border-gray-100 rounded-xl text-sm text-gray-600">
          Welcome back 👋 Manage everything from here
        </div>
      </div>
    );
  };
  
  export default DashboardHeader;