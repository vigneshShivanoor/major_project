// leave.controller.js
import Leave from "../models/leave.model.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const applyLeave = async (req, res) => {
  try {
    const { userId, startDate, endDate, leaveType, reason } = req.body;
    const primaryApprover = "6795dd028da3d527929978f1";

    let documentUrl = null;
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      documentUrl = result.secure_url;
    }

    const leave = new Leave({
      userId,
      startDate,
      endDate,
      leaveType,
      reason,
      documentUrl,
      primaryApprover,
    });

    await leave.save();
    res.status(201).json({ message: "Leave application submitted", leave });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
