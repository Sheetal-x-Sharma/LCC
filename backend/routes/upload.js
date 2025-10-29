import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Use in-memory storage (no local disk)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"), false);
    }
  },
});

// ====== POST Upload (Images only) ======
router.post("/posts", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer → base64 → data URI
    const base64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "campus_connect/posts",
      resource_type: "image",
    });

    // Return Cloudinary URL
    res.status(200).json({ fileUrl: result.secure_url });
  } catch (err) {
    console.error("❌ Post upload error:", err);
    res.status(500).json({ error: "Failed to upload post", details: err.message });
  }
});

// ====== STORY Upload (Images or Videos) ======
router.post("/stories", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer → base64 → data URI
    const base64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;

    // Upload to Cloudinary (auto-detect type)
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "campus_connect/stories",
      resource_type: req.file.mimetype.startsWith("video")
        ? "video"
        : "image",
    });

    // Return Cloudinary URL
    res.status(200).json({ fileUrl: result.secure_url });
  } catch (err) {
    console.error("❌ Story upload error:", err);
    res.status(500).json({ error: "Failed to upload story", details: err.message });
  }
});

// ====== Optional: General Upload Route ======
// allows POST /api/upload for simple image upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const base64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "campus_connect/general",
    });

    res.status(200).json({ fileUrl: result.secure_url });
  } catch (err) {
    console.error("❌ General upload error:", err);
    res.status(500).json({ error: "Failed to upload file", details: err.message });
  }
});

export default router;
