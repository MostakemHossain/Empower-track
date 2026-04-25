import AppError from "../errors/app-error.js";
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

  return {
    user,
    employee,
    generatedPassword: rawPassword,
  };
};

const getAllEmployees = async (req) => {
  const { search, department, status } = req.query;

  const query = {
    isDeleted: false, 
  };

  // 🔍 Search
  if (search) {
    const searchRegex = new RegExp(search, "i");

    query.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", " ", "$lastName"] },
            regex: search,
            options: "i",
          },
        },
      },
    ];
  }

  // 🏢 Department
  if (department && department !== "ALL") {
    query.department = department;
  }

  // 🟢 Status (FIXED)
  if (status && status !== "ALL") {
    query.employmentStatus = status;
  }

  const employees = await Employee.find(query)
    .populate("user", "email role")
    .sort({ createdAt: -1 });

  return {
    total: employees.length,
    data: employees,
  };
};

const updateEmployee = async (req) => {
  const { id } = req.params;

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
    employmentStatus,
  } = req.body;

  // 🔍 1. Check employee exists
  const existingEmployee = await Employee.findById(id);

  if (!existingEmployee) {
    throw new AppError("Employee not found");
  }

  // 🖼️ 2. Image upload (optional)
  let photoUrl = existingEmployee.photo;

  if (req.file) {
    const uploaded = await fileUploader.uploadToCloudinary(req.file);

    if (uploaded?.secure_url) {
      photoUrl = uploaded.secure_url;
    } else {
      throw new Error("Image upload failed");
    }
  }

  // 🧠 3. Prepare update data
  const updateData = {
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
    employmentStatus,
    photo: photoUrl,
  };

  // ❗ undefined field remove (important)
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  // 🔄 4. Update employee
  const updatedEmployee = await Employee.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).populate("user", "email role");

  return updatedEmployee;
};

const deleteEmployee = async (req) => {
  const { id } = req.params;

  const employee = await Employee.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!employee) {
    throw new AppError("Employee not found");
  }

  return employee;
};
export const EmployeeService = {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};