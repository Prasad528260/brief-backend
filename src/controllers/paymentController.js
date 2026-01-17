import instance from "../utils/razorpay.js";
import Payment from "../models/Payment.js";
import { amount } from "../utils/constants.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const createPayment = async (req, res) => {
  try {
    const user = req.user;
    const order = await instance.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt_order_1",
      notes: {
        name: user.name,
      },
    });
    console.log(order);
    const payment = await Payment.create({
      orderId: order.id,
      userId: user._id,
      notes:order.notes,
      amount:order.amount,
      currency:order.currency,
      receipt:order.receipt,
      status:order.status,
    });
    const savedPayment = await payment.save();

    return res.status(200).json({
      status: 200,
      message: "Payment created successfully",
      data: savedPayment,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Payment failed" + error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const webhookSignature = req.get("x-razorpay-signature");
    const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body),webhookSignature,process.env.RAZORPAY_WEBHOOK_SECRET);

    if(!isWebhookValid){
      return res.status(400).json({
        message: "Invalid webhook signature",
      });
    }


    // UPDATE PAYMENT STATUS
    const paymentdetails = req.body.payload.payment.entity;
    console.log("paymentdetails : ", paymentdetails);
    const payment = await Payment.findOne({ orderId: paymentdetails.order_id });
    payment.status = paymentdetails.status;
    await payment.save();
    // MAKE USER PREMIUM
    const user = await User.findById(payment.userId);
    user.plan = "premium";
    await user.save();


    // if(req.body.event === "payment.captured"){
    //   // Update payment status
    // }
    // if(req.body.event === "payment.failed"){
    //   // Update payment status
    // }

    return res.status(200).json({
      message: "Payment verification successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Payment verification failed" + error.message,
    });
  }
};