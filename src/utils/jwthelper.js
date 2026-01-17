import jwt from "jsonwebtoken";
const isProd = process.env.NODE_ENV === "production";
export const generateToken = (res, userId) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
  httpOnly: true,
  secure: isProd,      // ✅ MUST be false in dev
  sameSite: "none",    // ✅ FIX
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});
};

export const getPayload = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = decoded;
  return _id;
};

export const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const {_id } = decoded
  return _id;
};
