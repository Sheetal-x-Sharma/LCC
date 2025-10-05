import "./comments.scss";
import { useEffect, useState, useContext } from "react";
import axios, { API_URL } from "../../axios";
import { AuthContext } from "../../context/authContext";
import Profileimg from "../../assets/images/img1.png";

const Comments = ({ postId, onCommentAdded }) => {
  const { currentUser, token } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${postId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setComments(res.data || []);
      } catch (err) {
        console.log("Failed to fetch comments:", err.response?.data || err);
      }
    };
    fetchComments();
  }, [postId, token]);

  const handleSend = async () => {
    if (!newComment.trim()) return;

    if (!currentUser || !token) {
      return alert("Login first to comment!");
    }

    try {
      const res = await axios.post(
        "/comments",
        { postId, comment_text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCmt = {
        ...res.data,
        created_at: new Date().toISOString(),
      };

      const updatedComments = [...comments, newCmt];
      setComments(updatedComments);
      setNewComment("");

      if (onCommentAdded) onCommentAdded(updatedComments.length);
    } catch (err) {
      console.log("Failed to send comment:", err.response?.data || err);
    }
  };

  const getProfileImage = (img) => {
    if (!img || img === "null" || img === "undefined") return Profileimg;
    if (img.startsWith("http")) return img;
    return `${API_URL}${img}`;
  };

  const currentUserImage = currentUser ? getProfileImage(currentUser.profile_img) : Profileimg;

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUserImage} alt="profile" />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>

     {comments.map((comment) => {
  // Use comment.profile_img if exists, otherwise fallback to currentUser if it's the latest comment
  const profileImage =
    comment.profile_img // backend returned
      ? getProfileImage(comment.profile_img)
      : comment.userId === currentUser?.id // newly added comment
      ? currentUserImage
      : Profileimg;

  return (
    <div className="comment" key={comment.id}>
      <img src={profileImage} alt="profile" />
      <div className="info">
        <span>{comment.name || "Anonymous"}</span>
        <p>{comment.comment_text}</p>
      </div>
      <span className="date">{timeAgo(comment.created_at)}</span>
    </div>
  );
})}

    </div>
  );
};

export default Comments;
