import { pool } from "../connect.js"; // use pool for persistent connections

// GET all posts (optionally filter by userId)
export const getPosts = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = `
      SELECT 
        p.id,
        p.user_id AS userId,
        p.desc_text AS \`desc\`,
        p.img_url AS img,
        p.likes_count,
        p.comments_count,
        p.shares_count,
        p.created_at,
        u.name,
        u.profile_img AS profilePic
      FROM posts AS p
      JOIN users AS u ON p.user_id = u.id
    `;
    const values = [];
    if (userId) {
      query += " WHERE p.user_id = ?";
      values.push(userId);
    }
    query += " ORDER BY p.created_at DESC";

    const [rows] = await pool.execute(query, values);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// ADD a new post, update user's posts_count, and notify followers
export const addPost = async (req, res) => {
  try {
    const { user_id, desc_text, img_url } = req.body;
    if (!user_id || !desc_text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Insert post
    const [result] = await pool.execute(
      `INSERT INTO posts (user_id, desc_text, img_url, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [user_id, desc_text, img_url || null]
    );
    const postId = result.insertId;

    // 2️⃣ Update posts_count in users table
    await pool.execute(
      `UPDATE users SET posts_count = posts_count + 1 WHERE id = ?`,
      [user_id]
    );

    // 3️⃣ Notify followers
    const [followers] = await pool.execute(
      "SELECT follower_id FROM followers WHERE following_id = ?",
      [user_id]
    );
    if (followers.length > 0) {
      const values = followers
        .map(f => `(${f.follower_id}, ${user_id}, ${postId}, 'post')`)
        .join(",");
      await pool.execute(
        `INSERT INTO notifications (user_id, actor_id, post_id, type) VALUES ${values}`
      );
    }

    // 4️⃣ Return newly created post
    const [newPost] = await pool.execute(
      `SELECT 
        p.id,
        p.user_id AS userId,
        p.desc_text AS \`desc\`,
        p.img_url AS img,
        p.likes_count,
        p.comments_count,
        p.shares_count,
        p.created_at,
        u.name,
        u.profile_img AS profilePic
      FROM posts AS p
      JOIN users AS u ON p.user_id = u.id
      WHERE p.id = ?`,
      [postId]
    );

    res.status(201).json(newPost[0]);
  } catch (err) {
    console.error("❌ Error adding post:", err);
    res.status(500).json({ error: "Failed to add post" });
  }
};

// DELETE a post & update user's posts_count
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // 1️⃣ Find post's user_id first
    const [rows] = await pool.execute(
      "SELECT user_id FROM posts WHERE id = ?",
      [postId]
    );
    if (!rows.length) return res.status(404).json({ error: "Post not found" });
    const userId = rows[0].user_id;

    // 2️⃣ Delete the post
    await pool.execute("DELETE FROM posts WHERE id = ?", [postId]);

    // 3️⃣ Decrement posts_count
    await pool.execute(
      "UPDATE users SET posts_count = posts_count - 1 WHERE id = ? AND posts_count > 0",
      [userId]
    );

    // 4️⃣ Delete related notifications for this post
    await pool.execute(
      "DELETE FROM notifications WHERE post_id = ?",
      [postId]
    );

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
