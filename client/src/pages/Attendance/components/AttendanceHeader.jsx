const AttendanceHeader = ({ user, currentTime }) => {
  return (
    <div className="lg:col-span-2 flex flex-col justify-center">
      <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
        {user?.role === "ADMIN" ? "Attendance History" : "Work Log"}
      </h1>

      <p className="text-slate-500 font-medium text-lg">
        {currentTime.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-5xl font-black text-indigo-600">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <span className="text-xl font-bold text-indigo-400">
          {currentTime
            .toLocaleTimeString([], { second: "2-digit" })
            .split(" ")[0]}
        </span>
      </div>
    </div>
  );
};

export default AttendanceHeader;