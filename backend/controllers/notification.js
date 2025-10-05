import { connectDB } from "../connect.js";

// Get notifications for the current user (excluding self)
export const getNotifications = async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.userId;

    const [rows] = await db.execute(
      `
      SELECT 
        n.id, 
        n.is_read, 
        n.actor_id, 
        u.name AS actor_name, 
        u.profile_img AS actor_profile, 
        n.created_at
      FROM notifications n
      JOIN users u ON n.actor_id = u.id
      WHERE n.user_id = ? AND n.actor_id != ?
      ORDER BY n.created_at DESC
      LIMIT 20
      `,
      [userId, userId] // exclude notifications from self
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Delete single notification
export const deleteNotification = async (req, res) => {
  try {
    const db = await connectDB();
    const notificationId = req.params.id;
    const userId = req.userId;

    const [result] = await db.execute(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [notificationId, userId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// Delete all notifications for the user
export const deleteAllNotifications = async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.userId;

    await db.execute("DELETE FROM notifications WHERE user_id = ?", [userId]);
    res.status(200).json({ message: "All notifications deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete notifications" });
  }
};
