const LoadMoreButton = ({
    loading,
    employees,
    visibleEmployees,
    onLoadMore,
  }) => {
    if (
      loading ||
      employees.length <= visibleEmployees
    ) {
      return null;
    }
  
    return (
      <div className="flex justify-center mt-10">
        <button
          onClick={onLoadMore}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
        >
          Load More
        </button>
      </div>
    );
  };
  
  export default LoadMoreButton;