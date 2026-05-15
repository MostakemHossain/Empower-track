const RecentActivity = ({ data }) => {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-5">
          Recent Activity
        </h2>
  
        <div className="space-y-4">
          {data?.recentAttendance?.length > 0 ? (
            data.recentAttendance.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    Attendance marked ({item.status})
                  </p>
  
                  <p className="text-xs text-gray-400">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
  
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold">
                  {item.workingHours || 0}h
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">
              No recent activity found.
            </p>
          )}
        </div>
      </div>
    );
  };
  
  export default RecentActivity;