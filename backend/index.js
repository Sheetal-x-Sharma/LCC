import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./connect.js";
import multer from "multer";
import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";

// Routes
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

// -------------------- MIDDLEWARE --------------------
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// -------------------- STATIC FILES --------------------
// Serve general public assets
app.use(express.static("public"));

// ✅ Serve uploads with CORS + ORB-safe headers
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public/uploads"), {
    setHeaders: (res, filePath) => {
      // Allow access from frontend
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

      // ORB / COEP / CORP safety
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");

      // Cache and security hints
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.setHeader("Content-Security-Policy", "cross-origin");

      // Default type hint (helps some browsers)
      if (!res.getHeader("Content-Type")) {
        res.type("image/jpeg");
      }
    },
  })
);

// -------------------- DATABASE --------------------
connectDB();

// -------------------- CLOUDINARY CONFIG --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- MULTER SETUP --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "video/mp4",
      "video/mkv",
      "video/webm",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only images and videos are allowed"));
  },
});

// -------------------- UPLOAD ROUTE --------------------
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File not found" });

    const localPath = `/uploads/${req.file.filename}`;
    res.status(200).json({ fileUrl: localPath });

    // Optional async Cloudinary backup upload
    cloudinary.uploader
      .upload(req.file.path, {
        resource_type: req.file.mimetype.startsWith("video") ? "video" : "image",
        folder: "campus_connect",
      })
      .then((result) => console.log("✅ Cloud upload success:", result.secure_url))
      .catch((err) => console.error("❌ Cloud upload failed:", err.message));
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload file" });
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
