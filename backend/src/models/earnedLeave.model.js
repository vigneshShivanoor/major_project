import mongoose from "mongoose";

const earnedLeaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    primaryApprover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminApprover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "67b4afcb49a185821e2b89c5",
    },
    status: {
      type: String,
      enum: ["Pending", "HOD Approved", "Admin Approved"],
      default: "Pending",
    },
    hodApprovalDate: { type: Date },
    adminApprovalDate: { type: Date },
  },
  { timestamps: true }
);

const EarnedLeave = mongoose.model("EarnedLeave", earnedLeaveSchema);
export default EarnedLeave;
