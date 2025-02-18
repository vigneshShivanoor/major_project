import Leave from "../models/leave.model.js";
import User from "../models/user.model.js";

const getPrimaryApproverId = async (role) => {
  const approver = await User.findOne({ role }); // Fetch user by role
  return approver ? approver._id : null; // Return ObjectId if found
};
// Helper function to calculate available CL for a user
const getAvailableCasualLeave = (user) => {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
  return user.casualLeaves?.[currentMonth] ?? 1.5; // Default CL is 1.5 per month
};

// Function to apply for leave
export const applyLeave = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      startDate,
      endDate,
      leaveType,
      reason,
      primaryApprover,
    } = req.body;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Get Primary Approver's ObjectId
    const primaryApproverId = await getPrimaryApproverId(primaryApprover);

    if (!primaryApproverId) {
      return res
        .status(400)
        .json({ message: "Primary Approver not found for the given role" });
    }
    // Validate leave type availability
    if (leaveType === "Casual Leave") {
      const availableCL = getAvailableCasualLeave(user);
      if (availableCL < 1)
        return res
          .status(400)
          .json({ message: "Not enough Casual Leave balance" });
    } else if (leaveType === "Special Leave" && user.specialLeaves <= 0) {
      return res
        .status(400)
        .json({ message: "Not enough Special Leave balance" });
    } else if (leaveType === "Half Pay Leave" && user.halfPayLeaves <= 0) {
      return res
        .status(400)
        .json({ message: "Not enough Half Pay Leave balance" });
    } else if (leaveType === "Earned Leave" && user.earnedLeaves < 5) {
      return res
        .status(400)
        .json({ message: "Minimum 5 Earned Leaves required to apply" });
    }

    // Save leave request
    const leave = new Leave({
      userId,
      fullName,
      startDate,
      endDate,
      leaveType,
      reason,
      primaryApprover: primaryApproverId,
      adminApprover: "67b4afcb49a185821e2b89c5", // Default admin approver
    });

    await leave.save();

    console.log(
      `✅ Leave applied successfully for ${user.fullName} (${leaveType}):`,
      leave
    );
    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    console.error("❌ Error applying leave:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to approve/reject leave
export const updateLeaveStatus = async (req, res) => {
  try {
    console.log("Received request to update status:", req.params.leaveId);
    console.log("Request body:", req.body);

    const { leaveId } = req.params;
    const { status } = req.body;

    console.log("hi");
    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const user = await User.findById(leave.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (status === "accepted") {
      // Deduct leave based on type
      if (leave.leaveType === "Casual Leave") {
        const currentMonth = new Date().getMonth() + 1;
        user.casualLeaves[currentMonth] = Math.max(
          0,
          getAvailableCasualLeave(user) - 1
        );
      } else if (leave.leaveType === "Special Leave") {
        user.specialLeaves = Math.max(0, user.specialLeaves - 1);
      } else if (leave.leaveType === "Half Pay Leave") {
        user.halfPayLeaves = Math.max(0, user.halfPayLeaves - 1);
      } else if (leave.leaveType === "Earned Leave") {
        user.earnedLeaves = Math.max(0, user.earnedLeaves - 1);
      }

      // Save updated leave balance
      await user.save();
    }

    leave.status = status;
    leave.primaryApprovalDate = new Date();
    await leave.save();

    console.log(
      `✅ Leave ${status} for ${user.fullName} (${leave.leaveType}). Updated balances:`,
      {
        casualLeaves: user.casualLeaves,
        specialLeaves: user.specialLeaves,
        halfPayLeaves: user.halfPayLeaves,
        earnedLeaves: user.earnedLeaves,
      }
    );

    res.json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    console.error("❌ Error updating leave status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Apply for Compensatory Casual Leave (CCL)
export const applyCCL = async (req, res) => {
  try {
    const { userId, fullName, workDate, reason } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.compensatoryLeaves += 1;
    await user.save();

    const leave = new Leave({
      userId,
      fullName,
      leaveType: "Compensatory Casual Leave",
      startDate: workDate,
      endDate: workDate,
      reason,
      primaryApprover: null,
    });

    await leave.save();
    res
      .status(201)
      .json({ message: "Compensatory Leave applied successfully", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Earned Leave

// Get User Leaves
export const getUserLeaves = async (req, res) => {
  try {
    const { userId } = req.params;
    const leaves = await Leave.find({ userId }).sort({ startDate: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Pending Approvals

export const getPendingApprovals = async (req, res) => {
  try {
    const { approverId } = req.params;

    // Fetch all pending leave applications assigned to this approver
    const pendingLeaves = await Leave.find({
      primaryApprover: approverId,
      status: "Pending",
    });

    // If no pending leaves, return empty array
    if (pendingLeaves.length === 0) {
      return res.status(200).json({ pendingLeaves: [], leaveBalances: {} });
    }

    // Fetch leave balances for each user in the pending leave list
    const userIds = pendingLeaves.map((leave) => leave.userId);
    const users = await User.find({ _id: { $in: userIds } }).select(
      "_id fullName casualLeaves specialLeaves halfPayLeaves earnedLeaves"
    );

    // Map users by ID for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    // Attach leave balances to pending leaves
    const pendingLeavesWithBalances = pendingLeaves.map((leave) => ({
      ...leave.toObject(),
      leaveBalances: userMap[leave.userId] || {},
    }));

    return res.status(200).json({ pendingLeaves: pendingLeavesWithBalances });
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Leave Applications
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("userId", "fullName email")
      .populate("primaryApprover", "fullName email")
      .sort({ startDate: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Leave Counters for a User
export const getLeaveCounters = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    console.log(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const counters = {
      CL: user.casualLeaves || 0,
      HPL: user.halfPayLeaves || 0,
      CCL: user.compensatoryLeaves || 0,
      SL: user.specialLeaves || 0,
      EL: user.earnedLeaves || 0,
      StudyLeave: user.studyLeaves || 0,
    };

    res.status(200).json(counters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
