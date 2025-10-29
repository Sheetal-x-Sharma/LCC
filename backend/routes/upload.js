import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ===== CLOUDINARY CONFIG =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== MULTER SETUP (Memory storage - no local saving) =====
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isImageOrVideo =
      file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
    if (isImageOrVideo) cb(null, true);
    else cb(new Error("Only images or videos are allowed"), false);
  },
});

// ===== UPLOAD POST (images only, but auto handles videos too) =====
router.post("/posts", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    // Convert buffer to base64 string
    const fileBuffer = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBuffer, {
      folder: "campus_connect/posts",
      resource_type: "auto",
    });

    console.log("✅ Uploaded to Cloudinary:", result.secure_url);

    // Return Cloudinary URL
    res.status(200).json({ fileUrl: result.secure_url });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err.message);
    res.status(500).json({ error: "Failed to upload post" });
  }
});

// ===== UPLOAD STORY (images or videos) =====
router.post("/stories", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const fileBuffer = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBuffer, {
      folder: "campus_connect/stories",
      resource_type: "auto",
    });

    console.log("✅ Story uploaded to Cloudinary:", result.secure_url);

    res.status(200).json({ fileUrl: result.secure_url });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err.message);
    res.status(500).json({ error: "Failed to upload story" });
  }
});

export default router;
