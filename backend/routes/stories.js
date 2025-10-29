import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import moment from "moment";
import { pool } from "../connect.js";

dotenv.config();
const router = express.Router();

// ===== Cloudinary Config =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== Multer Config (Memory Storage) =====
const storage = multer.memoryStorage();
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

    const q = `
      SELECT s.*, u.name, u.profile_img 
      FROM stories AS s 
      JOIN users AS u ON u.id = s.user_id
      ORDER BY s.created_at DESC
      LIMIT 10
    `;
    const [data] = await pool.query(q);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ GET /stories failed:", err);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// ===== ADD STORY =====
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    // JWT Verification
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json("Not logged in!");
    const token = authHeader.split(" ")[1];
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    // Get user_id safely
    const userId = userInfo?.id || userInfo?.userId;
    if (!userId) return res.status(400).json({ error: "Invalid token: user id missing" });

    // Determine media type
    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    // Upload to Cloudinary via stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "campus_connect/stories",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const fileUrl = uploadResult.secure_url;
    const expiresAt = moment().add(24, "hours").format("YYYY-MM-DD HH:mm:ss");

    // ✅ Save to Database
    const [result] = await pool.query(
      "INSERT INTO stories (user_id, img_url, media_type, created_at, expires_at) VALUES (?, ?, ?, NOW(), ?)",
      [userId, fileUrl, mediaType, expiresAt]
    );

    if (result.affectedRows === 0) throw new Error("DB insert failed");

    res.status(200).json({
      message: "Story uploaded successfully!",
      fileUrl,
      media_type: mediaType,
    });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: err.message || "Failed to upload story" });
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
    const [result] = await pool.query(
      "DELETE FROM stories WHERE id = ? AND user_id = ?",
      [storyId, userInfo.id]
    );

    if (result.affectedRows === 0)
      return res.status(403).json("You can delete only your story!");

    res.status(200).json("Story deleted successfully!");
  } catch (err) {
    console.error("❌ Delete story failed:", err);
    res.status(500).json("Something went wrong!");
  }
});

export default router;
