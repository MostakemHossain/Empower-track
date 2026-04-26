import express from "express";
import { LeaveController } from "../controller/leave-controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-leave", auth("EMPLOYEE"), LeaveController.createLeave);

const LeaveRoute = router;
export default LeaveRoute;