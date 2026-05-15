const AttendanceSkeleton = ({ user }) => {
  return (
    <tr className="animate-pulse">
      <td className="px-8 py-5">
        <div className="h-4 w-6 bg-slate-200 rounded" />
      </td>

      {user?.role === "ADMIN" && (
        <>
          <td className="px-8 py-5">
            <div className="h-4 w-32 bg-slate-200 rounded" />
          </td>
          <td className="px-8 py-5">
            <div className="h-4 w-20 bg-slate-200 rounded" />
          </td>
        </>
      )}

      <td className="px-8 py-5">
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </td>

      <td className="px-8 py-5">
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </td>

      <td className="px-8 py-5">
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </td>

      <td className="px-8 py-5">
        <div className="h-4 w-12 bg-slate-200 rounded" />
      </td>

      <td className="px-8 py-5">
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </td>

      <td className="px-8 py-5 text-right">
        <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
      </td>
    </tr>
  );
};

export default AttendanceSkeleton;
