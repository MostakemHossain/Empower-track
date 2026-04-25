import express from "express";
import { AuthController } from "../controller/auth-controller.js";
import validateRequest from "../middlewares/validate-request.js";
import { AuthValidation } from "../../client/src/validations/auth-validations.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/login",validateRequest(AuthValidation.loginValidationSchema), AuthController.loginUser);
router.post("/change-password", auth("ADMIN","EMPLOYEE"),AuthController.changePassword);
const AuthRoutes = router;
export default AuthRoutes;
