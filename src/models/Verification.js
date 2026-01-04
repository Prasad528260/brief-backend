import mongoose from "mongoose";
import { Schema } from "mongoose";

const verificationSchema = new Schema({

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    code: {
      type: String,
      required: true,
      length: 6
    },

    expiresAt: {
      type: Date,
      required: true
    },

    used: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
);

const Verification = mongoose.model("EmailOtp", verificationSchema);
export default Verification;
