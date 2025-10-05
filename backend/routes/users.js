import express from "express";
import { getUser, updateUser, upload } from "../controllers/user.js";

const router = express.Router();

// Fetch user by ID
router.get("/:userId", getUser);

// Update user (with image upload)
router.put(
  "/:userId",
  upload.fields([
    { name: "profile_img", maxCount: 1 },
    { name: "cover_img", maxCount: 1 },
  ]),
  updateUser
);

export default router;
