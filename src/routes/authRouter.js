import router from "express";
import { signupController, loginController, logoutController,verifyOtpController } from "../controllers/authController.js";

const authRouter = router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/verify-otp", verifyOtpController);

export default authRouter;
