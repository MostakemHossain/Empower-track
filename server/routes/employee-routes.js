import express from "express";
import { EmployeeController } from "../controller/employee-controller.js";
import { fileUploader } from '../shared/fileUpload.js';
import { parseMultipartData } from "../middlewares/parseData.js";
const router = express.Router();

router.post(
  "/create-employee",
  //   auth("admin", "super-admin"),
  fileUploader.upload.single("file"),
  parseMultipartData,
  EmployeeController.createEmployee
);
router.get(
  "/get-all-employees", 
  //   auth("admin", "super-admin"),
  EmployeeController.getAllEmployees
);
router.put(
  "/update-employee/:id",
  fileUploader.upload.single("file"),
  parseMultipartData,
  EmployeeController.updateEmployee
);

const EmployeeRouter = router;
export default EmployeeRouter;
