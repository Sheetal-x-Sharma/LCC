// backend/routes/comments.js
import express from "express";
import { getCommentsByPost, addComment } from "../controllers/comment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:postId", getCommentsByPost);
router.post("/", verifyToken, addComment); // only logged-in users can add comments

export default router;
