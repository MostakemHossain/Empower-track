import sendEmail from "../config/nodemailer.js";
import AppError from "../errors/app-error.js";
import Employee from "../models/employee-modal.js";
import User from "../models/user-model.js";
import { fileUploader } from "../shared/fileUpload.js";
import bcrypt from "bcrypt";

const createEmployee = async (req) => {
  const {
    firstName,
    lastName,
    personalEmail, // Received from frontend
    phone,
    position,
    department,
    baseSalary,
    allowances,
    deductions,
    dob,
    joiningDate,
    address,
    bio,
    employmentStatus
  } = req.body;

  // 🔹 1. Generate Employee ID
  const lastEmployee = await Employee.findOne({}).sort({ createdAt: -1 });
  let newNumber = 1;
  if (lastEmployee?.employeeId) {
    const lastNumber = parseInt(lastEmployee.employeeId.split("-").pop());
    newNumber = lastNumber + 1;
  }
  const formattedNumber = String(newNumber).padStart(3, "0");
  const employeeId = `EM-Track-${formattedNumber}`;

  // 🔹 2. Generate Work Email
  const cleanFirstName = firstName.toLowerCase().replace(/\s+/g, "");
  const workEmail = `${cleanFirstName}${formattedNumber}@empowertrack.com`;

  // 🔹 3. Prepare Password
  const rawPassword = `${employeeId}@${cleanFirstName}`;
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 🔹 4. Handle Image Upload (logic remains same)
  let photoUrl = "";
  if (req.file) {
    const uploaded = await fileUploader.uploadToCloudinary(req.file);
    photoUrl = uploaded?.secure_url || "";
  }

  // 🔹 5. Create User (Work Account)
  const user = await User.create({
    email: workEmail,
    password: hashedPassword,
    role: "EMPLOYEE",
    needsPasswordChange: true, // Forces change on login
  });

  // 🔹 6. Create Employee Profile
  const employee = await Employee.create({
    user: user._id,
    firstName,
    lastName,
    personalEmail,
    employeeId,
    phone,
    position,
    department,
    baseSalary,
    allowances,
    deductions,
    dateOfBirth : dob,
    joiningDate,
    address,
    bio,
    employmentStatus,
    photo: photoUrl,
  });

  // 🔹 7. Send Email to Personal Address
  const emailSubject = `Welcome to the Team, ${firstName}! 🚀`;

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to EmpowerTrack</h1>
        <p style="color: #bfdbfe; margin-top: 10px; font-size: 16px;">We're thrilled to have you on board!</p>
      </div>

      <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #334155;">Hi <strong>${firstName} ${lastName}</strong>,</p>
        <p style="font-size: 16px; color: #334155; line-height: 1.6;">
          Your official employee profile has been successfully set up. You can now access the company portal using the credentials below.
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Access Credentials</h3>
          <p style="margin: 10px 0; font-size: 15px; color: #475569;">
            <strong>Work Email / Login:</strong> <span style="color: #2563eb;">${workEmail}</span>
          </p>
          <p style="margin: 10px 0; font-size: 15px; color: #475569;">
            <strong>Employee ID:</strong> <mark style="background-color: #fef08a; padding: 2px 5px; border-radius: 3px; font-weight: bold;">${employeeId}</mark>
          </p>
          <p style="margin: 10px 0; font-size: 15px; color: #475569;">
            <strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 3px 6px; border-radius: 4px; font-family: monospace;">${rawPassword}</code>
          </p>
        </div>

        <p style="font-size: 14px; color: #ef4444; font-weight: 500;">
          ⚠️ Note: You will be required to change your password immediately upon your first login for security.
        </p>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

        <h4 style="color: #1e293b; margin-bottom: 10px;">Quick Policies & Reminders:</h4>
        <ul style="padding-left: 20px; color: #64748b; font-size: 13px; line-height: 1.8;">
          <li><strong>Confidentiality:</strong> Do not share your login credentials with anyone.</li>
          <li><strong>Usage:</strong> All activities on the EmpowerTrack portal should comply with the company code of conduct.</li>
          <li><strong>Support:</strong> If you face issues logging in, please contact the IT department or your HR manager.</li>
        </ul>

        <div style="text-align: center; margin-top: 40px;">
          <a href="https://yourportal.com/login" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
        </div>
      </div>

      <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; 2026 EmpowerTrack Systems. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail(personalEmail, emailSubject, emailHtml);
  } catch (error) {
    console.error("Email failed to send:", error);
    // You might want to return a warning here, but don't stop the process
  }

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
  const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("user", "email role");

  return updatedEmployee;
};

const deleteEmployee = async (req) => {
  const { id } = req.params;

  const employee = await Employee.findByIdAndUpdate(
    id,
    { isDeleted: true, employmentStatus: "INACTIVE" },
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
