import React, { useState } from "react";
import { dummyPayslipData, dummyEmployeeData } from "../assets/assets";
import {  Download, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaySlips = () => {
  const role = "employee"; // "employee"
  const currentUserId = "69b411e6f8a807df391d7b13";
  const navigate = useNavigate();

  const [payslips, setPayslips] = useState(dummyPayslipData);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    year: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // FILTER
  const filteredPayslips =
    role === "employee"
      ? payslips.filter((p) => p.employeeId === currentUserId)
      : payslips;

  // STATS
  const totalPayslips = filteredPayslips.length;
  const totalSalary = filteredPayslips.reduce(
    (acc, p) => acc + p.netSalary,
    0
  );
  const avgSalary =
    totalPayslips > 0 ? (totalSalary / totalPayslips).toFixed(2) : 0;

  const formatMonth = (m, y) => `${months[m - 1]} ${y}`;

  // GENERATE
  const handleGenerate = () => {
    const basic = Number(form.basicSalary);
    const allowances = Number(form.allowances);
    const deductions = Number(form.deductions);

    const netSalary = basic + allowances - deductions;

    const employee = dummyEmployeeData.find(
      (e) => e._id === form.employeeId
    );

    const newPayslip = {
      _id: Date.now().toString(),
      employeeId: form.employeeId,
      month: Number(form.month),
      year: Number(form.year),
      basicSalary: basic,
      allowances,
      deductions,
      netSalary,
      employee,
    };

    setPayslips([newPayslip, ...payslips]);
    setOpenModal(false);

    setForm({
      employeeId: "",
      month: "",
      year: "",
      basicSalary: "",
      allowances: "",
      deductions: "",
    });
  };

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-black text-slate-800">
            Payslips
          </h1>
          <p className="text-slate-500">
            Salary management system
          </p>
        </div>

        {role === "admin" && (
          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2"
          >
            <Plus size={18} />
            Generate Payslip
          </button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Total Payslips
          </p>
          <h2 className="text-3xl font-black mt-2">
            {totalPayslips}
          </h2>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Total Salary
          </p>
          <h2 className="text-3xl font-black mt-2">
            ${totalSalary}
          </h2>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Average Salary
          </p>
          <h2 className="text-3xl font-black mt-2">
            ${avgSalary}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-3xl shadow ">

        <table className="w-full min-w-[900px]">

          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-8 py-5">#</th>
              <th className="px-8 py-5">Employee</th>
              <th className="px-8 py-5">Month</th>
              <th className="px-8 py-5">Basic</th>
              <th className="px-8 py-5">Allowances</th>
              <th className="px-8 py-5">Deductions</th>
              <th className="px-8 py-5">Net</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {filteredPayslips.map((p, i) => (
              <tr key={p._id} className="hover:bg-indigo-50/40">

                <td className="px-8 py-5 font-bold">
                  {i + 1}
                </td>

                <td className="px-8 py-5 font-bold">
                  {p.employee?.firstName} {p.employee?.lastName}
                </td>

                <td className="px-8 py-5">
                  {formatMonth(p.month, p.year)}
                </td>

                <td className="px-8 py-5">${p.basicSalary}</td>
                <td className="px-8 py-5 text-emerald-600">
                  +${p.allowances}
                </td>
                <td className="px-8 py-5 text-rose-600">
                  -${p.deductions}
                </td>

                <td className="px-8 py-5 font-black text-indigo-600">
                  ${p.netSalary}
                </td>

                <td className="px-8 py-5 text-right space-x-2">
                  

                  <button 
                  onClick={() => navigate(`/print/payslips/${p._id}`)}
                  className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Download size={18} />
                  </button>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {openModal && role === "admin" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">

            <h2 className="text-xl font-bold mb-4">
              Generate Payslip
            </h2>

            <div className="space-y-3">

              {/* EMPLOYEE */}
              <select
                className="w-full border p-3 rounded-xl"
                value={form.employeeId}
                onChange={(e) =>
                  setForm({ ...form, employeeId: e.target.value })
                }
              >
                <option value="">Select Employee</option>
                {dummyEmployeeData.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>

              {/* MONTH + YEAR FLEX */}
              <div className="flex gap-3">

                <select
                  className="w-1/2 border p-3 rounded-xl"
                  value={form.month}
                  onChange={(e) =>
                    setForm({ ...form, month: e.target.value })
                  }
                >
                  <option value="">Month</option>
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  className="w-1/2 border p-3 rounded-xl"
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: e.target.value })
                  }
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

              </div>

              <input
                type="number"
                placeholder="Basic Salary"
                className="w-full border p-3 rounded-xl"
                onChange={(e) =>
                  setForm({ ...form, basicSalary: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Allowances"
                className="w-full border p-3 rounded-xl"
                onChange={(e) =>
                  setForm({ ...form, allowances: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Deductions"
                className="w-full border p-3 rounded-xl"
                onChange={(e) =>
                  setForm({ ...form, deductions: e.target.value })
                }
              />

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
              >
                Generate
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default PaySlips;