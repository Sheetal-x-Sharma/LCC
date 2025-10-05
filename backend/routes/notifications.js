import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getNotifications, deleteNotification, deleteAllNotifications } from "../controllers/notification.js";

const router = express.Router();

// GET /notifications
router.get("/", verifyToken, getNotifications);

// DELETE single notification
router.delete("/:id", verifyToken, deleteNotification);

// DELETE all notifications
router.delete("/", verifyToken, deleteAllNotifications);

export default router;
