import express from "express";
import {
  applyEarnedLeave,
  updateEarnedLeaveStatus,
  getPendingEarnedLeavesAdmin,
  getPendingEarnedLeaves,
} from "../controllers/earnedLeave.controller.js";

const router = express.Router();
router.get("/pending/:approverId", getPendingEarnedLeaves);
router.post("/apply", applyEarnedLeave);
router.get("/pending-admin", getPendingEarnedLeavesAdmin);

router.patch("/update-status/:leaveId", updateEarnedLeaveStatus);

export default router;
