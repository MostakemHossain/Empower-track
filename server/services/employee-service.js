import Employee from "../models/employee-modal.js";
import User from "../models/user-model.js";
import { fileUploader } from "../shared/fileUpload.js";
import bcrypt from "bcrypt";
const createEmployee = async (req) => {
  const {
    firstName,
    lastName,
    phone,
    position,
    department,
    baseSalary,
    allowances,
    deductions,
    dateOfBirth,
    joiningDate,
    address,
    bio,
  } = req.body;

  // 🔹 1. Get last employee
  const lastEmployee = await Employee.findOne({})
    .sort({ createdAt: -1 })
    .select("employeeId");

  let newNumber = 1;

  if (lastEmployee?.employeeId) {
    const lastNumber = parseInt(lastEmployee.employeeId.split("-").pop());
    newNumber = lastNumber + 1;
  }

  const formattedNumber = String(newNumber).padStart(3, "0");
  const employeeId = `EM-Track-${formattedNumber}`;

  // 🔹 2. Email generate
  const cleanFirstName = firstName.toLowerCase().replace(/\s+/g, "");
  const email = `${cleanFirstName}${formattedNumber}@empowertrack.com`;

  // 🔹 3. Image upload
  let photoUrl = "";
  const file = req.file;

  if (file) {
    const uploaded = await fileUploader.uploadToCloudinary(file);

    if (uploaded?.secure_url) {
      photoUrl = uploaded.secure_url;
    } else {
      throw new Error("Image upload failed");
    }
  }

  // 🔹 4. PASSWORD (your format)
  const rawPassword = `${employeeId}@${firstName.toLowerCase().replace(/\s+/g, "")}`;
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 🔹 5. Create User
  const user = await User.create({
    email,
    password: hashedPassword,
    role: "EMPLOYEE",
  });

  // 🔹 6. Create Employee
  const employee = await Employee.create({
    user: user._id,
    firstName,
    lastName,
    employeeId,
    phone,
    position,
    department,
    baseSalary,
    allowances,
    deductions,
    dateOfBirth,
    joiningDate,
    address,
    bio,
    photo: photoUrl,
  });

  // 🔹 7. Return + send password (IMPORTANT)
  return {
    user,
    employee,
    generatedPassword: rawPassword,
  };
};

export const EmployeeService = {
  createEmployee,
};