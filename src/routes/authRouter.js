import router from "express";
import {
  signupController,
  loginController,
  logoutController,
  verifyOtpController,
} from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuth.js";
const authRouter = router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/verify-otp", verifyOtpController);
authRouter.get("/me", userAuth, (req, res) => {
  res.status(200).json({
    data: req.user,
    status: 200,
    message: "User fetched successfully",
  });
});

export default authRouter;
