import { connectDB } from "../connect.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const dbPromise = connectDB();

// ✅ Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

// ✅ Get user profile by ID with dynamic post count
export const getUser = async (req, res) => {
  try {
    const db = await dbPromise;

    // Fetch user
    const [userData] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.userId]);
    if (!userData.length) return res.status(404).json("User not found!");
    const user = userData[0];

    // Count posts
    const [[{ count }]] = await db.query(
      "SELECT COUNT(*) AS count FROM posts WHERE user_id = ?",
      [req.params.userId]
    );
    user.posts_count = count;

    res.status(200).json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update user details (with optional image upload)
export const updateUser = async (req, res) => {
  try {
    const db = await dbPromise;
    const userId = req.params.userId;

    const {
      name,
      batch,
      bio,
      about,
      linkedin_url,
      github_url,
      personal_website,
      city,
      facebook_url,
      instagram_url,
    } = req.body;

    // ✅ Store paths as "/uploads/filename"
    const profile_img = req.files?.profile_img
      ? `/uploads/${req.files.profile_img[0].filename}`
      : null;
    const cover_img = req.files?.cover_img
      ? `/uploads/${req.files.cover_img[0].filename}`
      : null;

    const fields = [];
    const values = [];

    if (name) fields.push("name = ?"), values.push(name);
    if (batch) fields.push("batch = ?"), values.push(batch);
    if (bio) fields.push("bio = ?"), values.push(bio);
    if (about) fields.push("about = ?"), values.push(about);
    if (linkedin_url) fields.push("linkedin_url = ?"), values.push(linkedin_url);
    if (github_url) fields.push("github_url = ?"), values.push(github_url);
    if (personal_website) fields.push("personal_website = ?"), values.push(personal_website);
    if (city) fields.push("city = ?"), values.push(city);
    if (facebook_url) fields.push("facebook_url = ?"), values.push(facebook_url);
    if (instagram_url) fields.push("instagram_url = ?"), values.push(instagram_url);
    if (profile_img) fields.push("profile_img = ?"), values.push(profile_img);
    if (cover_img) fields.push("cover_img = ?"), values.push(cover_img);

    if (fields.length === 0) return res.status(400).json("No fields to update!");

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(userId);

    await db.query(query, values);
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};
