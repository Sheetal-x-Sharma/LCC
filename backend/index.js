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

app.set("trust proxy", 1);

// ✅ CORS
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
app.use(express.static("public"));
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public/uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  })
);

// -------------------- CLOUDINARY CONFIG --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- MULTER SETUP (MEMORY STORAGE) --------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
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

// -------------------- UPLOAD ROUTE (Direct to Cloudinary) --------------------
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File not found" });

    // Convert buffer → base64
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "campus_connect",
      resource_type: "auto",
    });

    console.log("✅ Uploaded to Cloudinary:", result.secure_url);

    // Return Cloudinary URL (save this in DB)
    return res.status(200).json({ fileUrl: result.secure_url });
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// -------------------- GOOGLE IMAGE PROXY --------------------
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
