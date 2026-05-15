const EmployeeSkeleton = () => {
    return (
      <div className="animate-pulse bg-white p-5 rounded-2xl shadow-sm">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
  
        <div className="h-4 bg-gray-200 mt-4 w-3/4 mx-auto rounded"></div>
  
        <div className="h-3 bg-gray-200 mt-2 w-1/2 mx-auto rounded"></div>
  
        <div className="h-3 bg-gray-200 mt-3 w-1/3 mx-auto rounded"></div>
  
        <div className="h-10 bg-gray-200 mt-5 rounded-xl"></div>
  
        <div className="h-6 bg-gray-200 mt-4 w-1/3 mx-auto rounded-full"></div>
  
        <div className="h-10 bg-gray-200 mt-5 rounded-xl"></div>
      </div>
    );
  };
  
  export default EmployeeSkeleton;