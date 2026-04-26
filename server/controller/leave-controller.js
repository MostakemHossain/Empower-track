import { LeaveService } from "../services/leave-service.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";
import httpStatus from "http-status";

const createLeave = catchAsync(async (req, res) => {
  const result = await LeaveService.createLeave(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leave request submitted successfully!",
    data: result,
  });
});
const getLeaves = catchAsync(async (req, res) => {
  const result = await LeaveService.getLeaves(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leaves retrieved successfully!",
    data: result,
  });
});
const updateLeaveStatus = catchAsync(async (req, res) => {
  const result = await LeaveService.updateLeaveStatus(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leave status updated successfully!",
    data: result,
  });
});

export const LeaveController = {
  createLeave,
  getLeaves,
  updateLeaveStatus,
};
