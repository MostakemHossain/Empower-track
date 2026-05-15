const EmptyState = () => {
    return (
      <div className="col-span-full text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700">
          No Employees Found
        </h2>
  
        <p className="text-gray-500 mt-2">
          Try changing filters or search keyword.
        </p>
      </div>
    );
  };
  
  export default EmptyState;