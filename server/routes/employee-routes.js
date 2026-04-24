import express from "express";
import { EmployeeController } from "../controller/employee-controller.js";
import { fileUploader } from '../shared/fileUpload.js';
const router = express.Router();

router.post(
  "/create-employee",
  //   auth("admin", "super-admin"),
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req.body?.data);
    return EmployeeController.createEmployee(req, res, next);
  }
);
router.get(
  "/get-all-employees", 
  //   auth("admin", "super-admin"),
  EmployeeController.getAllEmployees
);

const EmployeeRouter = router;
export default EmployeeRouter;
