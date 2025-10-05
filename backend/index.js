import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";
import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import storiesRoutes from "./routes/stories.js";
import commentsRoutes from "./routes/comments.js";
import userRoutes from "./routes/users.js";
import likesRoutes from "./routes/likes.js";
import followersRoute from "./routes/follows.js";
import notificationsRoute from "./routes/notifications.js";

dotenv.config();
const app = express();

// ✅ TRUST PROXY for secure cookies via Render/Vercel
app.set("trust proxy", 1);

// ✅ FIXED CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lcc-frontend-lemon.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// -------------------- STATIC FILES --------------------
// Keep for general access, but users should fetch via proxy for CORS safety
app.use(express.static("public"));

// -------------------- CLOUDINARY CONFIG --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- MULTER SETUP --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "video/mp4",
      "video/mkv",
      "video/webm",
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

// -------------------- UPLOAD ROUTE --------------------
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File not found" });

  const localPath = `/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl: localPath });

  cloudinary.uploader
    .upload(req.file.path, {
      resource_type: req.file.mimetype.startsWith("video") ? "video" : "image",
      folder: "campus_connect",
    })
    .then((result) => console.log("✅ Cloud upload success:", result.secure_url))
    .catch((err) => console.error("❌ Cloud upload failed:", err.message));
});

// -------------------- IMAGE PROXY (CORS SAFE) --------------------
app.get("/api/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).json({ error: "Missing url param" });

    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");

    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Failed to proxy image" });
  }
});

// ✅ OPTIONAL: Redirect all /uploads requests to proxy to fix OpaqueResponseBlocking
app.get("/uploads/:filename", (req, res) => {
  const url = `${process.env.API_URL || `http://localhost:${process.env.PORT || 8800}`}/uploads/${req.params.filename}`;
  res.redirect(`/api/proxy-image?url=${encodeURIComponent(url)}`);
});

// -------------------- ROUTES --------------------
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/followers", followersRoute);
app.use("/api/notifications", notificationsRoute);

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
