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

export const LeaveController = {
  createLeave,
};