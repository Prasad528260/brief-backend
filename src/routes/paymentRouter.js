import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { createPayment, verifyPayment } from "../controllers/paymentController.js";
const paymentRouter = express.Router();

paymentRouter.post("/create", userAuth, createPayment)
paymentRouter.post("/webhook", verifyPayment)

export default paymentRouter;