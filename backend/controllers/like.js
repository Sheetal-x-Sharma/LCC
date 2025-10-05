import { pool } from "../connect.js"; // use pool instead of single connection

// Toggle like
export const toggleLike = async (req, res) => {
  const { postId } = req.body;
  try {
    // check if already liked
    const [rows] = await pool.execute(
      "SELECT * FROM likes WHERE user_id=? AND post_id=?",
      [req.userId, postId]
    );

    let liked;
    if (rows.length > 0) {
      // unlike
      await pool.execute("DELETE FROM likes WHERE user_id=? AND post_id=?", [
        req.userId,
        postId,
      ]);
      // decrement likes_count
      await pool.execute(
        "UPDATE posts SET likes_count = likes_count - 1 WHERE id=? AND likes_count > 0",
        [postId]
      );
      liked = false;
    } else {
      // like
      await pool.execute("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [
        req.userId,
        postId,
      ]);
      // increment likes_count
      await pool.execute("UPDATE posts SET likes_count = likes_count + 1 WHERE id=?", [
        postId,
      ]);
      liked = true;
    }

    // return updated like count
    const [post] = await pool.execute("SELECT likes_count FROM posts WHERE id=?", [
      postId,
    ]);

    res.json({ liked, likes_count: post[0].likes_count });
  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get like status for a user & post
export const getLikeStatus = async (req, res) => {
  const { postId } = req.query;
  try {
    if (!req.userId) return res.status(401).json({ liked: false });

    const [rows] = await pool.execute(
      "SELECT * FROM likes WHERE user_id=? AND post_id=?",
      [req.userId, postId]
    );
    // Also fetch current like count
    const [post] = await pool.execute("SELECT likes_count FROM posts WHERE id=?", [
      postId,
    ]);

    res.json({ liked: rows.length > 0, likes_count: post[0].likes_count });
  } catch (err) {
    console.error("Get like status error:", err);
    res.status(500).json({ message: err.message });
  }
};
