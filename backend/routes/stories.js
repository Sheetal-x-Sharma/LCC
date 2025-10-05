import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import moment from "moment";
import { connectDB } from "../connect.js";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
const dbPromise = connectDB();

// Ensure uploads/stories directory exists
const storiesDir = path.join(process.cwd(), "public/uploads/stories");
if (!fs.existsSync(storiesDir)) fs.mkdirSync(storiesDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storiesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"), false);
    }
  },
});

// ===== GET STORIES =====
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json("Not logged in!");
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const db = await dbPromise;
    const q = `
      SELECT s.*, u.name, u.profile_img 
      FROM stories AS s 
      JOIN users AS u ON u.id = s.user_id
      ORDER BY s.created_at DESC
      LIMIT 10
    `;
    const [data] = await db.query(q);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(403).json("Token is not valid!");
  }
});

// ===== ADD STORY (local + DB + async cloud) =====
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const localPath = "/uploads/stories/" + req.file.filename;
    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    // Auth
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json("Not logged in!");
    const token = authHeader.split(" ")[1];
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    // Save in DB
    const db = await dbPromise;
    const expiresAt = moment().add(24, "hours").format("YYYY-MM-DD HH:mm:ss");

    await db.query(
      "INSERT INTO stories (user_id, img_url, media_type, created_at, expires_at) VALUES (?, ?, ?, NOW(), ?)",
      [userInfo.id, localPath, mediaType, expiresAt]
    );

    // Respond immediately
    res.status(200).json({ fileUrl: localPath, media_type: mediaType });

    // Async Cloudinary backup
    cloudinary.uploader
      .upload(req.file.path, {
        folder: "campus_connect/stories",
        resource_type: mediaType,
      })
      .then(result => console.log("✅ Cloud backup uploaded:", result.secure_url))
      .catch(err => console.error("❌ Cloud backup failed:", err.message));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload story" });
  }
});

// ===== DELETE STORY =====
router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json("Not logged in!");
    const token = authHeader.split(" ")[1];
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const storyId = req.params.id;
    const db = await dbPromise;
    const [result] = await db.query(
      "DELETE FROM stories WHERE id = ? AND user_id = ?",
      [storyId, userInfo.id]
    );

    if (result.affectedRows === 0)
      return res.status(403).json("You can delete only your story!");

    res.status(200).json("Story deleted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong!");
  }
});

export default router;
