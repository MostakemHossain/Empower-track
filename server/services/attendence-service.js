import httpStatus from "http-status";
import Employee from "../models/employee-modal.js";
import Attendance from "../models/attendence-modal.js";
import AppError from "../errors/app-error.js";

const checkInOut = async (req) => {
  const userId = req.user.id;

  // 🔍 Find employee
  const employee = await Employee.findOne({ user: userId });
  if (!employee) {
    throw new AppError(httpStatus.NOT_FOUND, "Employee not found");
  }

  const now = new Date();

  // 🕙 Office time (10 AM - 5 PM)
  const officeStart = new Date();
  officeStart.setHours(10, 0, 0, 0);

  const officeEnd = new Date();
  officeEnd.setHours(17, 0, 0, 0);

  // ⏱ Optional grace time (10:15 AM)
  const lateThreshold = new Date();
  lateThreshold.setHours(10, 15, 0, 0);

  // 📅 Today range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 🔍 Find today's attendance
  let attendance = await Attendance.findOne({
    employee: employee._id,
    date: { $gte: todayStart, $lte: todayEnd },
  });

  // ===============================
  // ✅ CASE 1: CHECK-IN
  // ===============================
  if (!attendance) {
    const isLate = now > lateThreshold;

    attendance = await Attendance.create({
      employee: employee._id,
      date: todayStart,
      checkIn: now,
      status: isLate ? "LATE" : "PRESENT",
    });

    return {
      message: isLate ? "Check-in successful (Late)" : "Check-in successful",
      data: attendance,
    };
  }

  // ===============================
  // ✅ CASE 2: CHECK-OUT
  // ===============================
  if (attendance.checkIn && !attendance.checkOut) {
    attendance.checkOut = now;

    // 🔥 Working hours calculation
    const diffMs = attendance.checkOut - attendance.checkIn;
    const hours = diffMs / (1000 * 60 * 60);
    attendance.workingHours = Number(hours.toFixed(2));

    // 🔥 Day type (based on 6h office time)
    if (hours >= 8) {
      attendance.dayType = "Full Day";
    } else if (hours >= 6) {
      attendance.dayType = "Three Quarter Day";
    } else if (hours >= 4) {
      attendance.dayType = "Half Day";
    } else if (hours > 0) {
      attendance.dayType = "Short Day";
    } else {
      attendance.dayType = null;
    }

    await attendance.save();

    return {
      message: "Check-out successful",
      data: attendance,
    };
  }

  // ===============================
  // ❌ CASE 3: Already Done
  // ===============================
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "You have already checked out today"
  );
};

const getAttendanceEmployee = async (req) => {
  const employee = await Employee.findOne({ user: req.user.id });

  if (!employee) {
    throw new AppError(httpStatus.NOT_FOUND, "Employee not found");
  }

  const data = await Attendance.find({ employee: employee._id }).sort({
    date: -1,
  });

  return data;
};

export const AttendanceService = {
  checkInOut,
  getAttendanceEmployee,
};
