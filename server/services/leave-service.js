import AppError from "../errors/app-error.js";
import Employee from "../models/employee-modal.js";
import Leave from "../models/leave-modal.js";
import httpStatus from "http-status";

const createLeave = async (req) => {
    const userId = req.user.id;
    const { type, startDate, endDate, reason } = req.body;
  
    const employee = await Employee.findOne({ user: userId });
  
    if (!employee) {
      throw new AppError(httpStatus.NOT_FOUND, "Employee not found");
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (start > end) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Start date cannot be after end date"
      );
    }
  
    // 🔥 OVERLAP CHECK (FIXED)
    const overlap = await Leave.findOne({
      employee: employee._id,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });
  
    if (overlap) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Leave already exists in this date range"
      );
    }
  
    const leave = await Leave.create({
      employee: employee._id,
      type,
      startDate: start,
      endDate: end,
      reason,
    });
  
    return {
      message: "Leave request submitted successfully",
      data: leave,
    };
  };

export const LeaveService = {
  createLeave,
};