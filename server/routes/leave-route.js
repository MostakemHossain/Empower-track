import express from "express";
import { LeaveController } from "../controller/leave-controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-leave", auth("EMPLOYEE"), LeaveController.createLeave);
router.get("/get-leaves", auth("EMPLOYEE", "ADMIN"), LeaveController.getLeaves);
router.put(
  "/update-leave-status/:leaveId",
  auth("ADMIN"),
  LeaveController.updateLeaveStatus
);
const LeaveRoute = router;
export default LeaveRoute;
