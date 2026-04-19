import { useParams } from "react-router-dom";
import { dummyPayslipData } from "../assets/assets";
import { Printer } from "lucide-react";
import { useRef } from "react";

const PrintPaySlip = () => {
  const { id } = useParams();
  const printRef = useRef();

  const payslip = dummyPayslipData.find((p) => p._id === id);

  if (!payslip) {
    return (
      <div className="p-10 text-center text-red-500">
        Payslip Not Found
      </div>
    );
  }

  const employee = payslip.employee;

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const monthName = months[payslip.month - 1];
  const employeeId = "EMP-" + employee._id?.slice(-5).toUpperCase();

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-6">

      {/* PAYSLIP CARD */}
      <div
        ref={printRef}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 overflow-hidden"
      >

        {/* WATERMARK */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-[90px] font-bold text-slate-200 opacity-20 rotate-[-30deg]">
            EmpowerTrack
          </h1>
        </div>

        {/* HEADER */}
        <div className="relative flex justify-between items-start border-b pb-6 mb-6 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              EmpowerTrack
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Salary Payslip
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">Period</p>
            <p className="font-semibold text-slate-800">
              {monthName} {payslip.year}
            </p>
          </div>
        </div>

        {/* EMPLOYEE INFO */}
        <div className="relative space-y-2 mb-6 text-sm z-10">

          <p>
            <span className="text-slate-500">Employee ID: </span>
            <span className="font-medium">{employeeId}</span>
          </p>

          <p>
            <span className="text-slate-500">Name: </span>
            <span className="font-medium">
              {employee.firstName} {employee.lastName}
            </span>
          </p>

          <p>
            <span className="text-slate-500">Email: </span>
            <span className="font-medium">{employee.email}</span>
          </p>

          <p>
            <span className="text-slate-500">Department: </span>
            <span className="font-medium">{employee.department}</span>
          </p>

          <p>
            <span className="text-slate-500">Position: </span>
            <span className="font-medium">{employee.position}</span>
          </p>

        </div>

        {/* SALARY BREAKDOWN */}
        <div className="relative border-t border-b py-6 mb-6 space-y-3 text-sm z-10">

          <div className="flex justify-between">
            <span className="text-slate-600">Basic Salary</span>
            <span className="font-medium">${payslip.basicSalary}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-600">Allowances</span>
            <span className="font-medium text-emerald-600">
              + ${payslip.allowances}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-600">Deductions</span>
            <span className="font-medium text-red-500">
              - ${payslip.deductions}
            </span>
          </div>

        </div>

        {/* NET SALARY */}
        <div className="relative flex justify-between items-center mb-10 z-10">
          <span className="text-base font-semibold text-slate-700">
            Net Salary
          </span>
          <span className="text-2xl font-bold text-indigo-600">
            ${payslip.netSalary}
          </span>
        </div>

        {/* MANAGER SIGNATURE */}
        <div className="absolute bottom-10 right-10 text-right z-10">
          <p className="text-sm font-semibold text-slate-700">
            Authorized By
          </p>

          <div className="mt-2">
            <p className="text-lg font-bold text-slate-900 italic">
              EMP-MOSTAKEM
            </p>
            <div className="h-[1px] w-40 bg-slate-400 mt-1"></div>
            <p className="text-xs text-slate-500 mt-1">
              Company Manager
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="relative border-t pt-5 text-xs text-slate-500 space-y-1 z-10">
          <p>support@empowertrack.com</p>
          <p>+880 1234-567890</p>

          <p className="text-center pt-2 text-slate-400">
            This is a system-generated payslip.
          </p>
        </div>

        {/* PRINT BUTTON ONLY */}
        <div className="flex justify-center mt-10 print:hidden relative z-10">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            <Printer size={16} />
            Print
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrintPaySlip;