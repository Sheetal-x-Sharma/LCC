import { connectDB } from "../connect.js";

let db;
connectDB().then((c) => (db = c));

export const toggleLike = async (req, res) => {
  const { postId } = req.body;
  try {
    // check if already liked
    const [rows] = await db.query(
      "SELECT * FROM likes WHERE user_id=? AND post_id=?",
      [req.userId, postId]
    );

    let liked;
    if (rows.length > 0) {
      // unlike
      await db.query("DELETE FROM likes WHERE user_id=? AND post_id=?", [
        req.userId,
        postId,
      ]);
      // decrement likes_count
      await db.query(
        "UPDATE posts SET likes_count = likes_count - 1 WHERE id=? AND likes_count > 0",
        [postId]
      );
      liked = false;
    } else {
      // like
      await db.query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [
        req.userId,
        postId,
      ]);
      // increment likes_count
      await db.query("UPDATE posts SET likes_count = likes_count + 1 WHERE id=?", [
        postId,
      ]);
      liked = true;
    }

    // return updated like count
    const [post] = await db.query("SELECT likes_count FROM posts WHERE id=?", [
      postId,
    ]);

    res.json({ liked, likes_count: post[0].likes_count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get like status for a user & post
export const getLikeStatus = async (req, res) => {
  const { postId } = req.query;
  try {
    if (!req.userId) return res.status(401).json({ liked: false });
    const [rows] = await db.query(
      "SELECT * FROM likes WHERE user_id=? AND post_id=?",
      [req.userId, postId]
    );
    // Also fetch current like count
    const [post] = await db.query("SELECT likes_count FROM posts WHERE id=?", [
      postId,
    ]);
    res.json({ liked: rows.length > 0, likes_count: post[0].likes_count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
