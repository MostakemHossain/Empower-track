import { useParams } from "react-router-dom";
import { Printer, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const PrintPaySlip = () => {
  const { id } = useParams();
  const printRef = useRef();
  
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/payslip/get-payslip/${id}`);
        setPayslip(response?.data?.data); 
      } catch (error) {
        console.error(error);
        toast.error("Error fetching payslip details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPayslip();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Document...</p>
      </div>
    );
  }

  if (!payslip) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Payslip Not Found
      </div>
    );
  }

  const employee = payslip.employee;
  const monthName = months[payslip.month - 1];

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-0 md:p-6">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .print-container { padding: 0 !important; shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
          .no-print { display: none !important; }
        }
      `}} />
      <div
        ref={printRef}
        className="print-container relative w-full max-w-3xl bg-white md:rounded-2xl shadow-md p-8 md:p-12 overflow-hidden"
      >

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-[90px] font-bold text-slate-200 opacity-20 rotate-[-30deg] select-none">
            EmpowerTrack
          </h1>
        </div>
        <div className="relative flex justify-between items-start border-b pb-6 mb-8 z-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
              EmpowerTrack
            </h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">
              Official Salary Payslip
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pay Period</p>
            <p className="text-lg font-bold text-slate-800">
              {monthName} {payslip.year}
            </p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-6 mb-10 text-sm z-10">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</p>
              <p className="font-bold text-slate-800 text-base">{employee?.firstName} {employee?.lastName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID</p>
              <p className="font-semibold text-slate-700">{employee?.employeeId
              }</p>
            </div>
          </div>

          <div className="space-y-3 text-right">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</p>
              <p className="font-semibold text-slate-700">{employee?.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</p>
              <p className="font-semibold text-slate-700">{employee?.position || "Staff"}</p>
            </div>
          </div>
        </div>

        {/* SALARY BREAKDOWN TABLE */}
        <div className="relative z-10 mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-50">
                <td className="py-4 text-slate-600 font-medium">Basic Monthly Salary</td>
                <td className="py-4 text-right font-bold text-slate-800">${payslip.basicSalary?.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-50">
                <td className="py-4 text-slate-600 font-medium">Allowances (Bonus, Transport, Medical)</td>
                <td className="py-4 text-right font-bold text-emerald-600">+ ${payslip.allowances?.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 text-slate-600 font-medium">Deductions (Tax, Insurance, Penalties)</td>
                <td className="py-4 text-right font-bold text-rose-500">- ${payslip.deductions?.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* NET SALARY BOX */}
        <div className="relative flex justify-between items-center p-6 bg-slate-50 rounded-2xl mb-12 z-10">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Payable Amount</p>
            <p className="text-sm text-slate-500 italic mt-0.5">Total earnings after all deductions</p>
          </div>
          <span className="text-3xl font-black text-indigo-600">
            ${payslip.netSalary?.toLocaleString()}
          </span>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="relative flex justify-end mb-10 z-10">
          <div className="text-center">
             <p className="text-lg font-bold text-slate-900 italic font-serif">
              MOSTAKEM
            </p>
            <div className="h-[1.5px] w-48 bg-slate-300 mt-1 mx-auto"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
              Authorized Signature
            </p>
          </div>
        </div>


        <div className="relative border-t pt-6 text-[10px] font-bold text-slate-400 flex justify-between items-center z-10">
          <div className="flex gap-4">
            <p>support@empowertrack.com</p>
            <p>+880 1849545637</p>
          </div>
          <p className="uppercase tracking-tighter">System Generated • No Stamp Required</p>
        </div>

        <div className="no-print flex justify-center mt-12 relative z-20">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            <Printer size={20} strokeWidth={2.5} />
            Print This Payslip
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrintPaySlip;