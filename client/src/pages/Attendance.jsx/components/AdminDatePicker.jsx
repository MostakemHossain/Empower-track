const AdminDatePicker = ({ selectedDate, setSelectedDate }) => {
  // local today (NO UTC ISSUE)
  const getToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white p-6 rounded-4xl shadow-xl border border-slate-100 flex flex-col justify-center">
      
      <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
        Select Date
      </label>

      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          max={getToday()}   // ✅ TODAY allowed correctly
          onChange={(e) => setSelectedDate(e.target.value)}
          className="
            w-full
            appearance-none
            border border-slate-200
            rounded-2xl
            px-4 py-4
            text-slate-700
            font-medium
            outline-none
            bg-slate-50
            shadow-sm
            focus:ring-2 focus:ring-indigo-500
          "
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          📅
        </div>
      </div>

      
    </div>
  );
};

export default AdminDatePicker;