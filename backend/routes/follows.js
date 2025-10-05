import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowing,
} from "../controllers/follow.js";

const router = express.Router();

// ✅ Follow a user
router.post("/", verifyToken, followUser);

// ✅ Unfollow a user
router.delete("/:followingId", verifyToken, unfollowUser);

// ✅ Get followers of a user
router.get("/followers/:userId", getFollowers);

// ✅ Get following of a user
router.get("/following/:userId", getFollowing);

// ✅ Check if current user is following a specific user
router.get("/check/:followingId", verifyToken, checkFollowing);

export default router;
