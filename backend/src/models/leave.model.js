import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    leaveType: {
      type: String,
      required: true,
      enum: [
        "Casual Leave",
        "Half Pay Leave",
        "Compensatory Casual Leave",
        "Special Leave",
        "Study Leave",
        "Earned Leave",
      ],
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
      default: "6795dd028da3d527929978f1",
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "accepted", "rejected"],
    },
    primaryApprovalDate: { type: Date },
    finalApprovalDate: { type: Date },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
