import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  applyLeave,
  approveLeave,
  primaryApproveLeave,
} from "../controllers/leave.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Apply for leave
router.post("/apply", protectRoute, upload.single("document"), applyLeave);

// Primary approval route
router.put("/primary-approve/:id", protectRoute, primaryApproveLeave);

// Final approval route
router.put("/approve/:id", protectRoute, approveLeave);

export default router;
