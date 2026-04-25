import bcrypt from "bcrypt";
import User from "../models/user-model.js";
import Employee from "../models/employee-modal.js";
import config from "../config/index.js";
import AppError from "../errors/app-error.js";
import httpStatus from "http-status";
import { jwtHelpers } from "../helpers/jwt-helpers.js";

const loginUser = async (payload) => {
  const { identifier, password } = payload;
  let user;

  user = await User.findOne({ email: identifier }).select("+password");

  if (!user) {
    const employee = await Employee.findOne({
      employeeId: identifier,
    }).populate({
      path: "user",
      select: "+password",
    });

    if (!employee) {
      throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    }

    user = employee.user;

    if (employee.isDeleted) {
      throw new AppError(403, "Employee account is deleted");
    }

    if (employee.employmentStatus === "INACTIVE") {
      throw new AppError(403, "Employee account is inactive");
    }
  }

  const isValidPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!isValidPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  if (user.role === "EMPLOYEE") {
    const employee = await Employee.findOne({ user: user._id });

    if (!employee) {
      throw new AppError(404, "Employee profile not found");
    }

    if (employee.isDeleted) {
      throw new AppError(403, "Employee account is deleted");
    }

    if (employee.employmentStatus === "INACTIVE") {
      throw new AppError(403, "Employee account is inactive");
    }
  }

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt__access_secret,
    config.jwt__access_expire_in
  );

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    accessToken,
  };
};
const changePassword=async (req) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: "Password changed successfully" };
}
export const AuthService = {
    loginUser,
    changePassword
}