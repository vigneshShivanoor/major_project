import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
      enum: ["Sick Leave", "Casual Leave", "Earned Leave", "Other"], // Example leave types
    },
    reason: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String, // Cloudinary document URL
    },
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Final approver
    },
    primaryApprover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Primary approver
    },
    status: {
      type: String,
      default: "Pending", // "Pending", "Approved", "Rejected"
      enum: ["Pending", "Approved", "Rejected"],
    },
    primaryApprovalDate: {
      type: Date,
    },
    approvalDate: { type: Date },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
