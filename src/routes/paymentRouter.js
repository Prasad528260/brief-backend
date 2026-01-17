import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { createPayment, verifyPayment, verifyPremium } from "../controllers/paymentController.js";
const paymentRouter = express.Router();

paymentRouter.post("/create", userAuth, createPayment)
paymentRouter.post("/webhook", verifyPayment)
paymentRouter.get("/verify", userAuth, verifyPremium)
export default paymentRouter;