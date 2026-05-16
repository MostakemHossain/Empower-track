import Employee from "../models/employee-modal.js";
import Leave from "../models/leave-modal.js";
import Attendance from "../models/attendence-modal.js";
import AppError from "../errors/app-error.js";
import httpStatus from "http-status";
import Payslip from "../models/payslip-modal.js";
import { DEPARTMENTS } from "../constant/index.js";

const getDashboard = async (req) => {
  const userId = req?.user?.id;
  const role = req?.user?.role;

  if (role === "ADMIN") {
    const totalEmployees = await Employee.countDocuments({ isDeleted: false });
    
    const totalDepartments = DEPARTMENTS?.length

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
    });

    const pendingLeaves = await Leave.countDocuments({
      status: "PENDING",
      isDeleted: false,
    });

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setDate(end.getDate() - i);
      end.setHours(23, 59, 59, 999);

      const attendanceCount = await Attendance.countDocuments({
        date: { $gte: start, $lte: end },
        status: "PRESENT",
      });

      last7Days.push({
        date: start,
        workingHours: attendanceCount, 
      });
    }

    const recentAttendance = await Attendance.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("date status workingHours");

    return {
      role: "ADMIN",
      totalEmployees,
      totalDepartments,
      todayAttendance,
      pendingLeaves,
      attendanceOverview: last7Days,
      recentAttendance,
    };
  }
  else if (role === "EMPLOYEE") {
    const employee = await Employee.findOne({ user: userId });

    if (!employee) {
      throw new AppError(httpStatus.NOT_FOUND, "Employee not found");
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const currentMonthAttendance = await Attendance.countDocuments({
      employee: employee._id,
      status: "PRESENT",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const pendingLeaves = await Leave.countDocuments({
      employee: employee._id,
      status: "PENDING",
    });

    const totalLeaves = await Leave.countDocuments({
      employee: employee._id,
      isDeleted: false,
    });

    const latestPayslip = await Payslip.findOne({
      employee: employee._id,
    }).sort({ createdAt: -1 });

    const attendanceOverview = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setDate(end.getDate() - i);
      end.setHours(23, 59, 59, 999);
      const dayRecord = await Attendance.findOne({
        employee: employee._id,
        date: { $gte: start, $lte: end },
      });

      attendanceOverview.push({
        date: start,
        workingHours: dayRecord && dayRecord.status === "PRESENT" ? dayRecord.workingHours : 0,
        status: dayRecord ? dayRecord.status : "ABSENT"
      });
    }

    return {
      role: "EMPLOYEE",
      currentMonthAttendance,
      pendingLeaves,
      totalLeaves,
      attendanceOverview,
      latestPayslip: latestPayslip
        ? {
            netSalary: latestPayslip.netSalary,
          }
        : null,
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        position: employee.position,
        department: employee.department,
      },
    };
  }

  else {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid role");
  }
};

export const DashboardService = {
  getDashboard,
};