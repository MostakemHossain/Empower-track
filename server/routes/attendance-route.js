import express from "express";
import { AttendanceController } from "../controller/attendance-controller.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/check-in-out", auth("EMPLOYEE"),AttendanceController.checkInOut);
router.get("/get-my-attendance",auth("EMPLOYEE"),AttendanceController.getAttendanceEmployee );
router.get("/get-attendance-by-date",auth("ADMIN"),AttendanceController.getAttendanceByDate );
const AttendanceRoute = router;
export default AttendanceRoute;
