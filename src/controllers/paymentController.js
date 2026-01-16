import instance from "../utils/razorpay.js";
import Payment from "../models/Payment.js";
import { amount } from "../utils/constants.js";

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

