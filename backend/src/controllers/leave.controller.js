import Leave from "../models/leave.model.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Apply for leave
export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason, approver, primaryApprover } =
      req.body;

    // Upload file to Cloudinary
    const result = req.file
      ? await cloudinary.v2.uploader.upload(req.file.path)
      : null;

    const leave = new Leave({
      userId: req.user._id,
      startDate,
      endDate,
      leaveType,
      reason,
      documentUrl: result?.secure_url || null,
      approver,
      primaryApprover,
    });

    await leave.save();
    res.status(201).json({ message: "Leave application submitted", leave });
  } catch (error) {
    console.error("Error applying leave:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Primary approval
export const primaryApproveLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (String(leave.primaryApprover) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to approve this leave" });
    }

    leave.status = "Approved";
    leave.primaryApprovalDate = new Date();

    await leave.save();
    res
      .status(200)
      .json({ message: "Leave approved by primary approver", leave });
  } catch (error) {
    console.error("Error approving leave:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Final approval
export const approveLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (String(leave.approver) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to approve this leave" });
    }

    if (leave.status !== "Approved") {
      return res
        .status(400)
        .json({
          message: "Leave must be approved by the primary approver first",
        });
    }

    leave.status = "Approved";
    await leave.save();
    res
      .status(200)
      .json({ message: "Leave approved by final approver", leave });
  } catch (error) {
    console.error("Error approving leave:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
