import Leave from "../models/leave.model.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const applyLeave = async (req, res) => {
  try {
    console.log("🟢 Leave Application Request Received");
    console.log("🔹 Request Body:", req.body);
    console.log("📂 Uploaded File:", req.file);

    const { userId, startDate, endDate, leaveType, reason, approver } =
      req.body;

    // Map approver role to corresponding ID
    const approverMapping = {
      HOD: "679cb8f8f166e4c978b60f5e",
      Admin: "6795dd028da3d527929978f1",
      Dean: "679cb9a0f166e4c978b60f6d",
    };

    const primaryApprover =
      approverMapping[approver] || approverMapping["Admin"]; // Default to Admin if not provided

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
    console.log("✅ Leave Application Saved:", leave);

    res.status(201).json({ message: "Leave application submitted", leave });
  } catch (error) {
    console.error("🚨 Error Processing Leave:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getUserLeaves = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔹 Fetching leaves for user: ${userId}`);

    const leaves = await Leave.find({ userId }).sort({ startDate: -1 });

    console.log("✅ User Leaves Found:", leaves);
    res.status(200).json(leaves);
  } catch (error) {
    console.error("🚨 Error Fetching Leaves:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
