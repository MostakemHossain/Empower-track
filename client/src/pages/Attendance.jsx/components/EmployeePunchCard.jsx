import { Loader2 } from "lucide-react";

const EmployeePunchCard = ({
  processing,
  handlePunch,
  isCurrentlyIn,
  hasFinishedToday,
}) => {
  return (
    <div className="bg-white p-8 rounded-4xl shadow-xl border border-slate-100 flex flex-col items-center text-center">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
          isCurrentlyIn
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5" />
        </svg>
      </div>

      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
        Shift Status
      </p>

      <h3 className="text-xl font-bold mb-6">
        {hasFinishedToday
          ? "Shift Completed"
          : isCurrentlyIn
          ? "Currently On-Duty"
          : "Ready to Start?"}
      </h3>

      <button
        onClick={handlePunch}
        disabled={processing || hasFinishedToday}
        className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all ${
          hasFinishedToday
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : isCurrentlyIn
            ? "bg-rose-500 hover:bg-rose-600 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        ) : isCurrentlyIn ? (
          "CHECK OUT"
        ) : (
          "CHECK IN"
        )}
      </button>
    </div>
  );
};

export default EmployeePunchCard;