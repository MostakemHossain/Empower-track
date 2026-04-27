import express from "express";
import auth from "../middlewares/auth.js";
import { PayslipController } from "../controller/payslip-controller.js";

const router = express.Router();

router.post("/create-payslip", auth("ADMIN"), PayslipController.createPayslip);
router.get("/get-payslips", auth("EMPLOYEE", "ADMIN"), PayslipController.getPayslip);
router.get("/get-payslip/:id", auth("EMPLOYEE", "ADMIN"), PayslipController.getPayslipById);

const PayslipRoute = router;

export default PayslipRoute;
