import EarnedLeave from "../models/earnedLeave.model.js";
import User from "../models/user.model.js";

// Apply for Earned Leave
export const applyEarnedLeave = async (req, res) => {
  try {
    const { userId, fullName, startDate, endDate, primaryApprover, reason } =
      req.body;

    console.log("Received Earned Leave request:", req.body); // Log request data

    const approver = await User.findOne({ role: primaryApprover });
    if (!approver) {
      console.error("Primary Approver not found:", primaryApprover);
      return res.status(400).json({ message: "Primary Approver not found" });
    }

    const leave = new EarnedLeave({
      userId,
      fullName,
      startDate,
      endDate,
      reason,
      primaryApprover: approver._id,
      adminApprover: "67b4afcb49a185821e2b89c5",
    });

    await leave.save();
    console.log("Earned Leave request saved:", leave);
    res
      .status(201)
      .json({ message: "Earned Leave request submitted successfully", leave });
  } catch (error) {
    console.error("Error in applyEarnedLeave:", error); // Log full error
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getPendingEarnedLeaves = async (req, res) => {
  try {
    const { approverId } = req.params;
    const pendingLeaves = await EarnedLeave.find({
      $or: [
        { primaryApprover: approverId }, // Fetch leaves where this user is HOD
        { adminApprover: "67b4afcb49a185821e2b89c5" }, // Fetch leaves for admin
      ],
      status: "Pending" || "HOD Approved",
    });

    res.json({ pendingEarnedLeaves: pendingLeaves });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const approveEarnedLeaveAdmin = async (req, res) => {
//   try {
//     const { leaveId } = req.params;
//     const { additionalLeaves } = req.body;

//     const leave = await EarnedLeave.findById(leaveId);
//     if (!leave || leave.status !== "HOD Approved")
//       return res.status(404).json({ message: "Invalid leave request" });

//     const user = await User.findById(leave.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.earnedLeaves += additionalLeaves;
//     await user.save();

//     leave.status = "Admin Approved";
//     leave.adminApprovalDate = new Date();
//     await leave.save();

//     res.json({ message: "Earned Leave Approved & Credited", leave });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const getPendingEarnedLeavesAdmin = async (req, res) => {
  try {
    const adminApproverId = "67b4afcb49a185821e2b89c5";
    const pendingLeaves = await EarnedLeave.find({
      adminApprover: adminApproverId,
      status: "HOD Approved",
    });

    res.json({ pendingEarnedLeaves: pendingLeaves });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateEarnedLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    const leave = await EarnedLeave.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const user = await User.findById(leave.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (status === "HOD Approved" && leave.status === "Pending") {
      leave.status = "HOD Approved";
      leave.hodApprovalDate = new Date();
    } else if (status === "Admin Approved" && leave.status === "HOD Approved") {
      // Calculate the number of earned leaves based on start & end date
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const earnedLeaveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both days

      // Update user earned leave balance
      user.earnedLeaves += earnedLeaveDays;
      await user.save();

      // Update leave status
      leave.status = "Admin Approved";
      leave.adminApprovalDate = new Date();
    } else {
      return res.status(400).json({ message: "Invalid status update" });
    }

    await leave.save();
    res.json({ message: "Leave status updated and balance credited", leave });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
