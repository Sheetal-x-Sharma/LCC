import { pool } from "../connect.js"; // <-- use pool instead of single connection

// Follow a user
export const followUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const { followingId } = req.body;

    if (!followingId) return res.status(400).json({ message: "Missing followingId" });
    if (followerId === followingId) return res.status(400).json({ message: "You cannot follow yourself" });

    // Check if already following
    const [existing] = await pool.execute(
      "SELECT * FROM followers WHERE follower_id=? AND following_id=?",
      [followerId, followingId]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "Already following" });

    // Insert follow relation
    await pool.execute(
      "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)",
      [followerId, followingId]
    );

    // Update counts
    await pool.execute("UPDATE users SET followers_count = followers_count + 1 WHERE id = ?", [followingId]);
    await pool.execute("UPDATE users SET following_count = following_count + 1 WHERE id = ?", [followerId]);

    res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: "Server error while following" });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = parseInt(req.params.followingId);

    const [result] = await pool.execute(
      "DELETE FROM followers WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Not following this user" });

    await pool.execute("UPDATE users SET followers_count = followers_count - 1 WHERE id = ?", [followingId]);
    await pool.execute("UPDATE users SET following_count = following_count - 1 WHERE id = ?", [followerId]);

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ message: "Server error while unfollowing" });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.profile_img FROM followers f 
       JOIN users u ON f.follower_id = u.id WHERE f.following_id = ?`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ message: "Server error fetching followers" });
  }
};

// Get following of a user
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.profile_img FROM followers f 
       JOIN users u ON f.following_id = u.id WHERE f.follower_id = ?`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Get following error:", err);
    res.status(500).json({ message: "Server error fetching following" });
  }
};

// Check if current user is following another user
export const checkFollowing = async (req, res) => {
  try {
    const followerId = req.userId;
    const { followingId } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM followers WHERE follower_id=? AND following_id=?",
      [followerId, followingId]
    );

    res.status(200).json({ following: rows.length > 0 });
  } catch (err) {
    console.error("Check following error:", err);
    res.status(500).json({ message: "Server error while checking following status" });
  }
};
