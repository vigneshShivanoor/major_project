// leave.model.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    leaveType: {
      type: String,
      required: true,
      enum: ["Sick Leave", "Casual Leave", "Earned Leave", "Other"],
    },
    reason: { type: String, required: true },
    documentUrl: { type: String },
    primaryApprover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "1232423r23823423", // Default primary approver ID
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    primaryApprovalDate: { type: Date },
    approvalDate: { type: Date },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
