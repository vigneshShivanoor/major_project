import express from "express";
import {
  applyLeave,
  applyCCL,
  getUserLeaves,
  getPendingApprovals,
  updateLeaveStatus,
  getAllLeaves,
  getLeaveCounters,
} from "../controllers/leave.controller.js";

const router = express.Router();

router.post("/apply", applyLeave);
router.post("/apply-ccl", applyCCL);

router.get("/:userId", getUserLeaves);
router.get("/pending/:approverId", getPendingApprovals);
router.patch("/update-status/:leaveId", updateLeaveStatus);
router.get("/", getAllLeaves);
router.get("/counters/:userId", getLeaveCounters);

export default router;
