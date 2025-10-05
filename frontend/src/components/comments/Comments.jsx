import "./comments.scss";
import { useEffect, useState, useContext } from "react";
import axios, { API_URL } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Comments = ({ postId, onCommentAdded }) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Helper function to show relative time
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.log("Failed to fetch comments:", err);
      }
    };
    fetchComments();
  }, [postId]);

  // Send new comment
  const handleSend = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(
        "/comments",
        { postId, comment_text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCmt = {
        ...res.data,
        created_at: new Date().toISOString(),
      };

      setComments((prev) => [...prev, newCmt]);
      setNewComment("");

      if (onCommentAdded) {
        onCommentAdded(comments.length + 1);
      }
    } catch (err) {
      console.log("Failed to send comment:", err.response?.data || err);
    }
  };

  // Utility to get full profile image URL
  const getProfileImage = (img) => {
    if (!img) return "/img1.png"; // fallback
    if (img.startsWith("http")) return img; // external URL (Google, etc.)
    return `${API_URL}${img}`; // prepend API_URL for backend images
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={getProfileImage(currentUser?.profile_img)} alt="profile" />
        <input
          type="text"
          placeholder="write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={getProfileImage(comment.profilePicture)} alt="profile" />
          <div className="info">
            <span>{comment.name || "Anonymous"}</span>
            <p>{comment.comment_text}</p>
          </div>
          <span className="date">{timeAgo(comment.created_at)}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
