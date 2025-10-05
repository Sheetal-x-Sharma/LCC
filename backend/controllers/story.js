import { pool } from "../connect.js"; // use pool for persistent connections
import jwt from "jsonwebtoken";
import moment from "moment";

// Middleware-like helper to get userId from JWT
const getUserIdFromToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) throw new Error("Not logged in");
  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Not logged in");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// GET STORIES
export const getStories = async (req, res) => {
  try {
    getUserIdFromToken(req); // will throw if invalid

    const q = `
      SELECT s.*, u.name, u.profile_img 
      FROM stories AS s 
      JOIN users AS u ON u.id = s.user_id
      ORDER BY s.created_at DESC
      LIMIT 10
    `;
    const [data] = await pool.execute(q);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(err.message === "Not logged in" ? 401 : 500).json(err.message);
  }
};

// ADD STORY
export const addStory = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const { img_url, media_type } = req.body;
    if (!img_url) return res.status(400).json("File URL is required");
    if (!media_type || !["image", "video"].includes(media_type))
      return res.status(400).json("media_type must be 'image' or 'video'");

    const expiresAt = moment().add(24, "hours").format("YYYY-MM-DD HH:mm:ss");

    await pool.execute(
      "INSERT INTO stories (user_id, img_url, media_type, created_at, expires_at) VALUES (?, ?, ?, NOW(), ?)",
      [userId, img_url, media_type, expiresAt]
    );

    res.status(200).json("Story has been added!");
  } catch (err) {
    console.error(err);
    res.status(err.message === "Not logged in" ? 401 : 500).json("Something went wrong!");
  }
};

// DELETE STORY
export const deleteStory = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const storyId = req.params.id;

    const [result] = await pool.execute(
      "DELETE FROM stories WHERE id = ? AND user_id = ?",
      [storyId, userId]
    );

    if (result.affectedRows === 0)
      return res.status(403).json("You can delete only your story!");

    res.status(200).json("Story deleted successfully!");
  } catch (err) {
    console.error(err);
    res.status(err.message === "Not logged in" ? 401 : 500).json("Something went wrong!");
  }
};
