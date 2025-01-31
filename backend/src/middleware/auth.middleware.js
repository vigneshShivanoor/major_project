import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    console.log("🔥 Cookies received:", req.cookies);
    console.log("🔥 Headers received:", req.headers);

    const token = req.cookies?.jwt || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      console.log("🚨 No token found!");
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("🚨 Invalid token!");
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("🚨 User not found in database!");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    console.log("✅ User authenticated:", req.user);
    next();
  } catch (error) {
    console.log("🚨 Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
