import User from "../models/User.js";
import {
  validateSignup,
  validateLogin,
  getHashedPassword,
  comparePassword,
} from "../utils/validate.js";
import { generateOTP } from "../utils/otpGenrator.js";
import { sendOTPEmail } from "../utils/sendEmail.js";
import Verification from "../models/Verification.js";
import { generateToken } from "../utils/jwthelper.js";

// * Signup Controller
export const signupController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const isValid = validateSignup({ email, password, name });
    if (!isValid) {
      console.log("SIGNUP VALIDATION FAILED");
      return res.status(400).json({ status: 400, message: "Invalid data" });
    }
    const user = await User.findOne({ email });
    if (user) {
      console.log("USER ALREADY EXISTS");
      return res.status(400).json({ status: 400, message: "User already exists" });
    }
    const hashedPassword = getHashedPassword(password);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    return res.status(201).json({
      data: {
        name: newUser.name,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
      },
      status: 201,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("SIGNUP FAILED", error);
    return res.status(500).json({ status: 500, message: "Signup failed" });
  }
};

// * Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isValid = validateLogin({ email, password });
    if (!isValid) {
      console.log("LOGIN VALIDATION FAILED");
      return res.status(400).json({ status: 400, message: "Invalid data" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(400).json({ status: 400, message: "User not found" });
    }
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log("INVALID PASSWORD");
      return res.status(400).json({ status: 400, message: "Invalid password" });
    }
    if (user.isEmailVerified) {
      generateToken(res, user._id);
      return res.status(200).json({
        data: {
          name: user.name,
          email: user.email,
          isEmailVerified: true,
          plan: user.plan,
          usage: user.usage,
        },
        status: 200,
        message: "Logged in successfully",
      });
    }

    // * only for unverified users
    const otp = generateOTP();

    const verification = await Verification.create({
      email,
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      data: {
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        plan: user.plan,
        usage: user.usage,
      },
      status: 200,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("LOGIN FAILED", error);
    return res.status(500).json({ status: 500, message: "Login failed" });
  }
};

// * Verify Otp Controller
export const verifyOtpController = async (req, res) => {
  try {
   
    const {email, otp } = req.body;
    const verification = await Verification.findOne({ email, code: otp });
    if (!verification) {

      return res.status(400).json({ status: 400, message: "Invalid OTP" });
    }

    if (verification.expiresAt < Date.now()) {
      return res.status(400).json({ status: 400, message: "OTP expired" });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true }
    );
    generateToken(res, user._id);
    return res
      .status(200)
      .json({
        data: {
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          plan: user.plan,
          usage: user.usage,
        },
        status: 200,
        message: "OTP verified successfully",
      });
  } catch (error) {
    console.log("VERIFY OTP FAILED", error);
    return res.status(500).json({ status: 500, message: "Verify OTP failed" });
  }
};

// * Logout Controller
export const logoutController = async (req, res) => {
  res.cookie("token", Date.now());
  return res.status(200).json({
    status: 200,
    message: "User logged out successfully",
  });
};
