import { EmployeeService } from "../services/employee-service.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";
import httpStatus from "http-status";


const createEmployee= catchAsync(async (req, res) => {
    const result = await EmployeeService.createEmployee(req);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Employee created successfully!',
      data: result,
    });
  });

const getAllEmployees = catchAsync(async (req, res) => {
    const result = await EmployeeService.getAllEmployees(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employees fetched successfully!',
      data: result,
    });
  });

  const updateEmployee = catchAsync(async (req, res) => {
    const result = await EmployeeService.updateEmployee(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employee updated successfully!',
      data: result,
    });
  })
  const deleteEmployee= catchAsync(async (req, res) => {
    const result = await EmployeeService.deleteEmployee(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employee deleted successfully!',
      data: result,
    });
  })
export const EmployeeController = {
    createEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee
}