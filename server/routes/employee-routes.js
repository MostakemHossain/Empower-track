import express from "express";
import { EmployeeController } from "../controller/employee-controller.js";
import { fileUploader } from '../shared/fileUpload.js';
import { parseMultipartData } from "../middlewares/parseData.js";
const router = express.Router();

router.post(
  "/create-employee",
  //   auth("admin"),
  fileUploader.upload.single("file"),
  parseMultipartData,
  EmployeeController.createEmployee
);
router.get(
  "/get-all-employees", 
  //   auth("admin"),
  EmployeeController.getAllEmployees
);
router.put(
  "/update-employee/:id",
  fileUploader.upload.single("file"),
  parseMultipartData,
  EmployeeController.updateEmployee
);

router.delete(
  "/delete-employee/:id",
  // auth("admin"),
  EmployeeController.deleteEmployee
);
const EmployeeRouter = router;
export default EmployeeRouter;
