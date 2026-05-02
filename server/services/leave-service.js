import AppError from "../errors/app-error.js";
import { inngest } from "../inngest/index.js";
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
  await inngest.send({
    name: "leave-request-created",
    data: {
      employeeId: employee._id.toString(),
      employeeName: `${employee.firstName} ${employee.lastName}`,
      leaveId: leave._id.toString(),
    },
  })

  return {
    message: "Leave request submitted successfully",
    data: leave,
  };
};

const getLeaves = async (req) => {
  const userId = req?.user?.id;
  const role = req?.user?.role;

  // =========================
  // 👤 EMPLOYEE
  // =========================
  if (role === "EMPLOYEE") {
    const employee = await Employee.findOne({ user: userId });

    if (!employee) {
      throw new AppError(httpStatus.NOT_FOUND, "Employee not found");
    }

    const leaves = await Leave.find({
      employee: employee._id,
    }).sort({ createdAt: -1 });

    const total = await Leave.countDocuments({
      employee: employee._id,
    });

    return {
      total,
      data: leaves,
    };
  } else {
    const leaves = await Leave.find({}).sort({ createdAt: -1 });

    const total = await Leave.countDocuments({});

    return {
      total,
      data: leaves,
    };
  }
};

const updateLeaveStatus = async (req) => {
  const role = req?.user?.role;
  const { leaveId } = req.params;
  const { status } = req.body;

  // if (role !== "ADMIN") {
  //   throw new AppError(httpStatus.FORBIDDEN, "Only admin can update leave status");
  // }

  // ❌ Validate status
  const allowedStatus = ["PENDING", "APPROVED", "REJECTED"];
  if (!allowedStatus.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status value");
  }

  // 🔍 Find leave
  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw new AppError(httpStatus.NOT_FOUND, "Leave not found");
  }

  // 🔥 Update status
  leave.status = status;
  await leave.save();

  return {
    leave,
  };
};

export const LeaveService = {
  createLeave,
  getLeaves,
  updateLeaveStatus,
};
