import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post.js";

const router = express.Router();

// GET all posts or filter by userId
router.get("/", getPosts);

// ADD new post
router.post("/", addPost);

// DELETE post by ID
router.delete("/:id", deletePost);

export default router;
