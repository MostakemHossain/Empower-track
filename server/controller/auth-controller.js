import { AuthService } from "../services/auth-service.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login successful!",
        data: result,
    });

})
const changePassword = catchAsync(async (req, res) => {
    const result = await AuthService.changePassword(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully!",
        data: result,
    });

})
export const AuthController = {
    loginUser,
    changePassword
}