import { ProfileService } from "../services/profile-service.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";
import httpStatus from "http-status";

const getMyProfile= catchAsync(async (req, res) => {
    const result = await ProfileService.getMyProfile(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile fetched successfully!',
      data: result,
    });
  
})
const updateMyProfile = catchAsync(async (req, res) => {
    const result = await ProfileService.updateMyProfile(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile updated successfully!',
      data: result,
    });
  
})

export const ProfileController = {
    getMyProfile,
    updateMyProfile
}