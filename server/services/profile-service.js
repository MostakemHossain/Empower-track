import User from "../models/user-model.js";
import Employee from "../models/employee-modal.js";
import { fileUploader } from "../shared/fileUpload.js";
import AppError from "../errors/app-error.js";

const getMyProfile = async (req) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  let profile = null;

  if (user.role === "EMPLOYEE") {
    profile = await Employee.findOne({ user: userId });
  }

  return {
    user,
    profile,
  };
};

const updateMyProfile = async (req) => {
    const userId = req.user.id;
  
    const employee = await Employee.findOne({ user: userId });
  
    if (!employee) {
      throw new AppError("Employee profile not found");
    }
  
    const {
      firstName,
      lastName,
      phone,
      address,
      bio,
    } = req.body;
  
    let photoUrl = employee.photo;
  
    if (req.file) {
      const uploaded = await fileUploader.uploadToCloudinary(req.file);
  
      if (uploaded?.secure_url) {
        photoUrl = uploaded.secure_url;
      } else {
        throw new Error("Image upload failed");
      }
    }
  
    const updateData = {
      firstName,
      lastName,
      phone,
      address,
      bio,
      photo: photoUrl,
    };
  
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
  
    const updatedProfile = await Employee.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    ).populate("user", "email role");
  
    return updatedProfile;
  };

export const ProfileService = {
  getMyProfile,
    updateMyProfile
};