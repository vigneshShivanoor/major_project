import express from "express";
import multer from "multer";
import { applyLeave } from "../controllers/leave.controller.js";
import { getUserLeaves } from "../controllers/leave.controller.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/apply", upload.single("document"), applyLeave);
router.get("/:userId", getUserLeaves);
export default router;
