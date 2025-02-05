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
      required: true,
    },
    adminApprover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: "6795dd028da3d527929978f1", // Fixed Admin Approver
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    primaryApprovalDate: { type: Date },
    finalApprovalDate: { type: Date },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
