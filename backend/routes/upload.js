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

// ===== MULTER (Memory storage — no local saving) =====
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isImageOrVideo =
      file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
    if (isImageOrVideo) cb(null, true);
    else cb(new Error("Only images or videos are allowed"), false);
  },
});

// ===== UPLOAD SINGLE FILE (used by frontend for posts) =====
// frontend calls POST /api/upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload directly to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "campus_connect/posts",
      resource_type: "auto", // handles both images & videos
    });

    console.log("✅ Uploaded to Cloudinary:", result.secure_url);

    // Return URL to frontend
    res.status(200).json({ fileUrl: result.secure_url });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err.message);
    res.status(500).json({ error: "Failed to upload file", details: err.message });
  }
});

// ===== OPTIONAL: UPLOAD STORY (if you also support stories) =====
router.post("/story", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "campus_connect/stories",
      resource_type: "auto",
    });

    console.log("✅ Story uploaded to Cloudinary:", result.secure_url);
    res.status(200).json({ fileUrl: result.secure_url });
  } catch (err) {
    console.error("❌ Cloudinary story upload error:", err.message);
    res.status(500).json({ error: "Failed to upload story", details: err.message });
  }
});

export default router;
