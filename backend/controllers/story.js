import { connectDB } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

const dbPromise = connectDB();

// GET STORIES
export const getStories = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json("Not logged in!");
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET);

    const db = await dbPromise;
    const q = `
      SELECT s.*, u.name, u.profile_img 
      FROM stories AS s 
      JOIN users AS u ON u.id = s.user_id
      ORDER BY s.created_at DESC
      LIMIT 10
    `;
    const [data] = await db.query(q);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(403).json("Token is not valid!");
  }
};

// ADD STORY
export const addStory = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json("Not logged in!");
    const token = authHeader.split(" ")[1];
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const { img_url, media_type } = req.body;

    if (!img_url) return res.status(400).json("File URL is required");
    if (!media_type || !["image", "video"].includes(media_type))
      return res.status(400).json("media_type must be 'image' or 'video'");

    const db = await dbPromise;
    const expiresAt = moment().add(24, "hours").format("YYYY-MM-DD HH:mm:ss");

    await db.query(
      "INSERT INTO stories (user_id, img_url, media_type, created_at, expires_at) VALUES (?, ?, ?, NOW(), ?)",
      [userInfo.id, img_url, media_type, expiresAt]
    );

    res.status(200).json("Story has been added!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong!");
  }
};

// DELETE STORY
export const deleteStory = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json("Not logged in!");
    const token = authHeader.split(" ")[1];
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const storyId = req.params.id;
    const db = await dbPromise;
    const [result] = await db.query(
      "DELETE FROM stories WHERE id = ? AND user_id = ?",
      [storyId, userInfo.id]
    );

    if (result.affectedRows === 0)
      return res.status(403).json("You can delete only your story!");

    res.status(200).json("Story deleted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong!");
  }
};
