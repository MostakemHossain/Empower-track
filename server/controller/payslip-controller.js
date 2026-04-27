import { PayslipService } from "../services/payslip-service.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";
import httpStatus from "http-status";

const createPayslip = catchAsync(async (req, res) => {
    const result = await PayslipService.createPayslip(req);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Payslip created successfully!",
        data: result,
    });
})
const getPayslip = catchAsync(async (req, res) => {
    const result = await PayslipService.getPayslip(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payslips retrieved successfully!",
        data: result,
    });
})

const getPayslipById = catchAsync(async (req, res) => {
    const result = await PayslipService.getPayslipById(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payslip retrieved successfully!",
        data: result,
    });
})

export const PayslipController = {
    createPayslip,
    getPayslip,
    getPayslipById
}