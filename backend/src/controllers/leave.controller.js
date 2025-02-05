import Leave from "../models/leave.model.js";
import User from "../models/user.model.js";
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

    const { userId, startDate, endDate, leaveType, reason, approverRole } =
      req.body;

    // Fetch Primary Approver ID based on selected role
    const primaryApproverUser = await User.findOne({ role: approverRole });
    if (!primaryApproverUser) {
      return res
        .status(400)
        .json({ message: "No user found for selected role." });
    }

    const primaryApprover = primaryApproverUser._id;
    const adminApprover = "6795dd028da3d527929978f1"; // Fixed Admin Approver

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
      adminApprover,
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

// Fetch pending leaves for a specific primary approver
export const getPendingApprovals = async (req, res) => {
  try {
    const { approverId } = req.params;
    console.log("Fetching leaves for Primary Approver ID:", approverId);

    const pendingLeaves = await Leave.find({
      primaryApprover: approverId,
      status: "pending",
    });

    console.log("Leaves found:", pendingLeaves);
    res.json(pendingLeaves);
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    res
      .status(500)
      .json({ message: "Error fetching pending approvals", error });
  }
};

// Update leave status (Accept/Reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    console.log(`Updating leave ${leaveId} to status: ${status}`);

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leave) {
      console.error("Leave request not found:", leaveId);
      return res.status(404).json({ message: "Leave request not found" });
    }

    console.log("Leave updated successfully:", leave);
    res.json({ message: "Leave status updated successfully", leave });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Error updating leave status", error });
  }
};
