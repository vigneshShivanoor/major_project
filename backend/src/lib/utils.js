import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // 🔹 Prevents XSS attacks
    secure: process.env.NODE_ENV !== "development", // 🔹 Uses HTTPS in production
    sameSite: "strict", // 🔹 Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 🔹 Expires in 7 days
  });

  return token;
};
