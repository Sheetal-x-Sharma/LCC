import express from "express";
import { toggleLike, getLikeStatus } from "../controllers/like.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Toggle like/unlike
router.post("/toggle", verifyToken, toggleLike);

// Get like status
router.get("/status", verifyToken, getLikeStatus);

export default router;
