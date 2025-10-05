import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// Ensure folders exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ===== POSTS UPLOAD (images only) =====
const postsDir = path.join(process.cwd(), "public/uploads/posts");
ensureDir(postsDir);

const storagePosts = multer.diskStorage({
  destination: (req, file, cb) => cb(null, postsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});

const uploadPosts = multer({
  storage: storagePosts,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images are allowed for posts"), false);
  },
});

// Posts route
router.post("/posts", uploadPosts.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const localPath = "/uploads/posts/" + req.file.filename;

    // Async Cloudinary backup
    cloudinary.uploader
      .upload(req.file.path, {
        folder: "campus_connect/posts",
        resource_type: "image",
      })
      .then((result) => console.log("✅ Cloud backup uploaded:", result.secure_url))
      .catch((err) => console.error("❌ Cloud backup failed:", err.message));

    res.status(200).json({ fileUrl: localPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload post" });
  }
});

// ===== STORIES UPLOAD (images or videos) =====
const storiesDir = path.join(process.cwd(), "public/uploads/stories");
ensureDir(storiesDir);

const storageStories = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storiesDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});

const uploadStories = multer({
  storage: storageStories,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only images and videos are allowed for stories"), false);
  },
});

// Stories route
router.post("/stories", uploadStories.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const localPath = "/uploads/stories/" + req.file.filename;

    // Async Cloudinary backup
    cloudinary.uploader
      .upload(req.file.path, {
        folder: "campus_connect/stories",
        resource_type: req.file.mimetype.startsWith("video") ? "video" : "image",
      })
      .then((result) => console.log("✅ Cloud backup uploaded:", result.secure_url))
      .catch((err) => console.error("❌ Cloud backup failed:", err.message));

    res.status(200).json({ fileUrl: localPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload story" });
  }
});

export default router;
