import { pool } from "../connect.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// -------------------- CLOUDINARY CONFIG --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- MULTER (MEMORY STORAGE) --------------------
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// -------------------- GET USER --------------------
export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [userData] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
    if (!userData.length) return res.status(404).json("User not found!");

    const user = userData[0];

    // Count posts dynamically
    const [[{ count }]] = await pool.execute(
      "SELECT COUNT(*) AS count FROM posts WHERE user_id = ?",
      [userId]
    );
    user.posts_count = count;

    res.status(200).json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- UPDATE USER --------------------
export const updateUser = async (req, res) => {
  try {
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

    let profile_img = null;
    let cover_img = null;

    // Upload profile image to Cloudinary
    if (req.files?.profile_img?.[0]) {
      const uploadRes = await cloudinary.uploader.upload_stream(
        { folder: "campus_connect/profile_images" },
        async (error, result) => {
          if (error) throw error;
          profile_img = result.secure_url;
        }
      );
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "campus_connect/profile_images" },
          (error, result) => {
            if (error) reject(error);
            else {
              profile_img = result.secure_url;
              resolve(result);
            }
          }
        );
        stream.end(req.files.profile_img[0].buffer);
      });
    }

    // Upload cover image to Cloudinary
    if (req.files?.cover_img?.[0]) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "campus_connect/cover_images" },
          (error, result) => {
            if (error) reject(error);
            else {
              cover_img = result.secure_url;
              resolve(result);
            }
          }
        );
        stream.end(req.files.cover_img[0].buffer);
      });
    }

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

    if (!fields.length) return res.status(400).json("No fields to update!");

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(userId);

    await pool.execute(query, values);
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};
