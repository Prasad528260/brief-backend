import mongoose from "mongoose";
import { Schema } from "mongoose";
import validator from "validator";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true,
        validate:{
            validator:validator.isEmail,
            message:"PLEASE ENTER A VALID EMAIL"
        }
    },
    password: {
        type:String,
        required:true,
        validate:{
            validator:validator.isStrongPassword,
            message:"PLEASE ENTER A STRONG PASSWORD"
        }
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    plan : {
      type: String,
      enum : ["free","premium"],
      default: "free",
    },
    summariesUsed: {
      type: Number,
      default: 0,
    },
    
    
  },
  {
    timestamps: true,
  }
);
userSchema.index({ email: 1 }, { unique: true })

const User = mongoose.model("User", userSchema);
export default User;