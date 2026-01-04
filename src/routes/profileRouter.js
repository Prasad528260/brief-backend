import express from "express";
import { getProfile, updateName } from "../controllers/ProfileController.js";
import { userAuth } from "../middleware/userAuth.js";

const profileRouter = express.Router();

profileRouter.get("/get-profile", userAuth, getProfile);
profileRouter.put("/update-name", userAuth, updateName);

export default profileRouter;