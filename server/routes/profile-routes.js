
import express from "express";

import auth from "../middlewares/auth.js";
import { ProfileController } from "../constant/profile-controller.js";
import { fileUploader } from "../shared/fileUpload.js";
import { parseMultipartData } from "../middlewares/parseData.js";
const router = express.Router();

router.get("/me", auth("ADMIN","EMPLOYEE"),ProfileController.getMyProfile);
router.put(
    "/update-my-profile",
    fileUploader.upload.single("file"),
    parseMultipartData,
    auth("EMPLOYEE"),
    ProfileController.updateMyProfile
  );

const ProfileRoutes = router;
export default ProfileRoutes;
