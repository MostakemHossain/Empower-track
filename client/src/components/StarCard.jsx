const StatCard = ({ title, value, color }) => (
  <div
    className={`p-8 rounded-4xl bg-linear-to-br ${color} text-white shadow-xl shadow-slate-200 relative overflow-hidden group`}
  >
    <div className="relative z-10">
      <p className="text-[10px] uppercase tracking-widest opacity-70 font-black">
        {title}
      </p>
      <h2 className="text-4xl font-black mt-1">{value}</h2>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
  </div>
);

export default StatCard;
