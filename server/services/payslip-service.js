import AppError from "../errors/app-error.js";
import Employee from "../models/employee-modal.js";
import Payslip from "../models/payslip-modal.js";
import httpStatus from "http-status";

const createPayslip = async (req) => {
  const payload = req.body;

  const { employee, month, year, basicSalary, allowances, deductions } =
    payload;

  const isEmployeeExist = await Employee.findById({
    _id:employee
  });
  if (!isEmployeeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Employee not found");
  }

  const isPayslipExist = await Payslip.findOne({
    employee,
    month,
    year,
  });

  if (isPayslipExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payslip already exists for this month"
    );
  }

  const netSalary = basicSalary + allowances - deductions;

  const result = await Payslip.create({
    employee,
    month,
    year,
    basicSalary,
    allowances,
    deductions,
    netSalary,
  });

  return result;
};

const getPayslip = async (req) => {
    const { page = 1, limit = 10, month, year, employee } = req.query;
    const filter = {};
  
    if (req.user.role === "EMPLOYEE") {
      filter.employee = req.user.employeeId;
    } else if (req.user.role === "ADMIN") {
      if (employee) filter.employee = employee;
    }

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
  
    const skip = (Number(page) - 1) * Number(limit);
    console.log(filter);
    const data = await Payslip.find(filter)
      .populate("employee",)
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(Number(limit));
  
    const total = await Payslip.countDocuments(filter);
  
    return {
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
      data,
    };
  };

  const getPayslipById = async (req) => {
    const { id } = req.params;
  
    const result = await Payslip.findById(id).populate("employee");
  
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Payslip not found");
    }
  
    return result;
  };

export const PayslipService = {
  createPayslip,
  getPayslip,
    getPayslipById, 
};
