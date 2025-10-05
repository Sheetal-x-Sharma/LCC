import { connectDB } from "../connect.js";
let db;
connectDB().then((c) => (db = c));

// ✅ Get comments for a post
export const getCommentsByPost = async (req, res) => {
  const postId = req.params.postId;
  try {
    const [comments] = await db.query(
      `SELECT c.*, u.name, u.profile_img AS profilePicture
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE post_id = ?
       ORDER BY c.created_at ASC`,
      [postId]
    );
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add a new comment
export const addComment = async (req, res) => {
  const { postId, comment_text } = req.body;

  if (!postId || !comment_text) {
    return res.status(400).json({ message: "postId and comment_text required" });
  }

  const userId = req.userId; // from verifyToken middleware

  try {
    const [result] = await db.query(
      "INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)",
      [postId, userId, comment_text]
    );

    // ✅ Update comments_count in posts
    await db.query(
      "UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?",
      [postId]
    );

    // ✅ Fetch inserted comment with user details
    const [newComment] = await db.query(
      `SELECT c.*, u.name, u.profile_img AS profilePicture
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: err.message });
  }
};
