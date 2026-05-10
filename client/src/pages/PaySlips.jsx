import React, { useState, useEffect } from "react";
import { Download, Plus, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";

const PaySlips = () => {
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  /* ================= FETCH DATA ================= */

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Payslips based on role
      let payslipRes;
      if (role === "ADMIN") {
        payslipRes = await api.get("/payslip/get-payslips");
        setPayslips(payslipRes?.data?.data?.data || []);
      } else {
        payslipRes = await api.get(`/payslip/get-payslip-by-employee`);
        setPayslips(payslipRes?.data?.data || []);
      }
     

      if (role === "ADMIN") {
        const empRes = await api.get("/employee/get-all-employees");
        setEmployees(empRes?.data?.data?.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ================= AUTO-FILL LOGIC ================= */

  const handleEmployeeSelect = (id) => {
    const selectedEmp = employees.find((emp) => emp._id === id);

    if (selectedEmp) {
      setForm({
        ...form,
        employeeId: id,
        basicSalary: selectedEmp.baseSalary || 0,
        allowances: selectedEmp.allowances || 0,
        deductions: selectedEmp.deductions || 0,
      });
    } else {
      setForm({ ...form, employeeId: "", basicSalary: "", allowances: "", deductions: "" });
    }
  };

  /* ================= ACTIONS ================= */

  const handleGenerate = async () => {
    if (!form.employeeId || !form.basicSalary || !form.month || !form.year) {
      return toast.error("Please fill required fields");
    }

    try {
      setSubmitLoading(true);
      const payload = {
        employeeId: form.employeeId,
        month: Number(form.month),
        year: Number(form.year),
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances || 0),
        deductions: Number(form.deductions || 0),
      };

      await api.post("/payslip/create-payslip", payload);
      
      toast.success("Payslip generated successfully");
      setOpenModal(false);
      
      // Reset Form
      setForm({
        employeeId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicSalary: "",
        allowances: "",
        deductions: "",
      });

      fetchData(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatMonth = (m, y) => `${months[m - 1]} ${y}`;

  // STATS
 
  const totalSalary = payslips.reduce((acc, p) => acc + (p.netSalary || 0), 0);
  const avgSalary = payslips.length > 0 ? (totalSalary / payslips.length).toFixed(0) : 0;

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Payroll</h1>
          <p className="text-slate-500 font-medium">Auto-synced salary management</p>
        </div>

        {role === "ADMIN" && (
          <button
            onClick={() => setOpenModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Generate Payslip
          </button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Records" value={payslips.length} color="from-indigo-600 to-blue-500" />
        <StatCard title="Total Payout" value={`$${totalSalary.toLocaleString()}`} color="from-emerald-600 to-teal-500" />
        <StatCard title="Avg Salary" value={`$${Number(avgSalary).toLocaleString()}`} color="from-amber-500 to-orange-500" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="font-bold tracking-widest uppercase text-xs">Syncing Payroll...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250">
              <thead className="bg-slate-50 text-[11px] uppercase text-slate-400 font-black tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-left">#</th>
                  <th className="px-8 py-5 text-left">Employee</th>
                  <th className="px-8 py-5 text-left">Period</th>
                  <th className="px-8 py-5 text-left">Basic</th>
                  <th className="px-8 py-5 text-left">Allowances</th>
                  <th className="px-8 py-5 text-left">Deductions</th>
                  <th className="px-8 py-5 text-left">Net</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payslips.map((p, i) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-slate-300 font-bold">{i + 1}</td>
                    <td className="px-8 py-5 font-bold text-slate-800">
                      {p.employee?.firstName} {p.employee?.lastName}
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium">{formatMonth(p.month, p.year)}</td>
                    <td className="px-8 py-5 text-slate-600 font-semibold">${p.basicSalary?.toLocaleString()}</td>
                    <td className="px-8 py-5 text-emerald-600 font-bold">+${p.allowances?.toLocaleString()}</td>
                    <td className="px-8 py-5 text-rose-500 font-bold">-${p.deductions?.toLocaleString()}</td>
                    <td className="px-8 py-5 font-black text-indigo-600 text-lg">${p.netSalary?.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => navigate(`/print/payslips/${p._id}`)}
                        className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all transform hover:rotate-12"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {openModal && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden relative">
            <button 
              onClick={() => setOpenModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-black text-slate-800 mb-2">New Payslip</h2>
            <p className="text-slate-400 text-sm mb-6">Database values will auto-fill on selection.</p>

            <div className="space-y-4">
              {/* EMPLOYEE SELECT */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff Member</label>
                <select
                  className="w-full border-slate-200 border-2 p-4 rounded-2xl mt-1 focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none bg-slate-50 font-bold text-slate-700"
                  value={form.employeeId}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                >
                  <option value="">Choose Employee</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.firstName} {e.lastName} ({e.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              {/* PERIOD */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Month</label>
                  <select
                    className="w-full border-slate-200 border-2 p-4 rounded-2xl mt-1 focus:ring-4 focus:ring-indigo-50 outline-none bg-slate-50 font-bold"
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                  >
                    {months.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year</label>
                  <select
                    className="w-full border-slate-200 border-2 p-4 rounded-2xl mt-1 focus:ring-4 focus:ring-indigo-50 outline-none bg-slate-50 font-bold"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SALARY FIELDS */}
              <InputField 
                label="Basic Salary ($)" 
                value={form.basicSalary} 
                onChange={(v) => setForm({ ...form, basicSalary: v })} 
              />
              
              <div className="flex gap-4">
                <InputField 
                  label="Allowances (+)" 
                  value={form.allowances} 
                  onChange={(v) => setForm({ ...form, allowances: v })} 
                  color="text-emerald-600"
                />
                <InputField 
                  label="Deductions (-)" 
                  value={form.deductions} 
                  onChange={(v) => setForm({ ...form, deductions: v })} 
                  color="text-rose-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={submitLoading}
                className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitLoading ? (
                   <Loader2 className="animate-spin" size={20} />
                ) : "Confirm & Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= HELPERS ================= */

const StatCard = ({ title, value, color }) => (
  <div className={`p-8 rounded-4xl bg-linear-to-br ${color} text-white shadow-xl shadow-slate-200 relative overflow-hidden group`}>
    <div className="relative z-10">
      <p className="text-[10px] uppercase tracking-widest opacity-70 font-black">{title}</p>
      <h2 className="text-4xl font-black mt-1">{value}</h2>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
  </div>
);

const InputField = ({ label, value, onChange, color = "text-slate-700" }) => (
  <div className="flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type="number"
      className={`w-full border-slate-200 border-2 p-4 rounded-2xl mt-1 focus:ring-4 focus:ring-indigo-50 outline-none bg-slate-50 font-bold ${color}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0.00"
    />
  </div>
);

export default PaySlips;