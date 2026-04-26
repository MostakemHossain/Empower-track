import express from "express";
import { AttendanceController } from "../controller/attendance-controller.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/check-in-out", auth("EMPLOYEE"),AttendanceController.checkInOut);
router.post("/get-my-attendance",auth("EMPLOYEE"),AttendanceController.getAttendanceEmployee );
const AttendanceRoute = router;
export default AttendanceRoute;
