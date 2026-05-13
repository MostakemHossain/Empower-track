import mongoose from "mongoose";
import { DEPARTMENTS } from "../constant/index.js";

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

  employeeId: { type: String, unique: true },

  personalEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  dateOfBirth: Date,
  joiningDate: Date,
  phone: { type: String, required: true },
  address: String,
  bio: String,
  photo: { type: String, default: "" },

  department: {
    type: String,
    enum: DEPARTMENTS,
  },

  position: { type: String, required: true },
  baseSalary: { type: Number, default: 0 },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },

  employmentStatus: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },

  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;