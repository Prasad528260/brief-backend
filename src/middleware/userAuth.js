import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../utils/jwthelper.js";

export const userAuth = async(req, res, next) => {
  try {
    const cookie = req.cookies;
    
    if (!cookie) {
      console.log("ERROR : COOKIE NOT FOUND");
      return res.status(401).json({ message: "Authentication cookie missing" });
    }
    const { token } = cookie;
    if (!token) {
      console.log("ERROR : TOKEN NOT FOUND");
      return res.status(401).json({ message: "Authentication token missing" });
    }
    const _id = verifyToken(token);
    const user = await User.findById(_id).select('-password')
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(401).json({ message: "ERROR : USER NOT FOUND" });
    }
    req.user = user;
    next();

  } catch (error) {
     console.log(
      "ERROR : USER AUTHENTICATION FAILED AT MIDDLEWARE",
      error.message
    );
    res.status(400).json({ message: "ERROR : USER AUTHENTICATION FAILED" });
  }
};
