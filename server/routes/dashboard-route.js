import express from "express";
import { DashboardController } from "../controller/dashboard-controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/get", auth("EMPLOYEE", "ADMIN"), DashboardController.getDashboard);

const DashboardRoute = router;

export default DashboardRoute;
