import { DashboardService } from "../services/dashboard-service.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";
import httpStatus from "http-status";

const getDashboard = catchAsync(async (req, res) => {
    const result = await DashboardService.getDashboard(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dashboard data fetched successfully!",
        data: result,
    });
})

export const DashboardController = {
    getDashboard,
}