import { AttendanceService } from "../services/attendence-service.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";
import httpStatus from "http-status";

const checkInOut = catchAsync(async (req, res) => {
  const result = await AttendanceService.checkInOut(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check-in/out successful!",
    data: result,
  });
});

const getAttendanceEmployee = catchAsync(async (req, res) => {
  const result = await AttendanceService.getAttendanceEmployee(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendance fetched successfully!",
    data: result,
  });
});

export const AttendanceController = {
  checkInOut,
  getAttendanceEmployee,
};
