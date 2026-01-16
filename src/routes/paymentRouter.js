import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { createPayment } from "../controllers/paymentController.js";
const paymentRouter = express.Router();

paymentRouter.post("/create", userAuth, createPayment)

export default paymentRouter;