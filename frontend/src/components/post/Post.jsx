import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useEffect, useRef, useState, useContext } from "react";
import axios, { API_URL } from "../../axios";
import { AuthContext } from "../../context/authContext";

// IMPORT LOCAL ICONS
import whatsappIcon from "../../assets/images/whatsapp.png";
import gmailIcon from "../../assets/images/email.png";
import telegramIcon from "../../assets/images/telegram.png";
import linkIcon from "../../assets/images/link.png";

const Post = ({ post, onCommentAdded }) => {
  const { currentUser } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const menuRef = useRef(null);
  const shareRef = useRef(null);

  const postUrl = `${window.location.origin}/posts/${post.id}`;

  // ------------------ TIME AGO ------------------
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
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  // ------------------ FETCH LIKE STATUS ------------------
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get(`${API_URL}/api/likes/status?postId=${post.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        setLiked(res.data.liked);
        setLikesCount(res.data.likes_count);
      } catch (err) {
        console.error("Failed to fetch like status:", err);
      }
    };
    fetchLikeStatus();
  }, [post.id, currentUser]);

  const handleToggleLike = async () => {
    if (!currentUser) return alert("Please login to like posts");
    try {
      const res = await axios.post(
        `${API_URL}/api/likes/toggle`,
        { postId: post.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
      );
      setLiked(res.data.liked);
      setLikesCount(res.data.likes_count);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  // ------------------ SHARE ------------------
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Check out this post",
        text: post.desc,
        url: postUrl,
      });
    } else {
      setShareOpen((prev) => !prev);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard!");
    setShareOpen(false);
  };

  // ------------------ CLICK OUTSIDE ------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("jwt");
      await fetch(`${API_URL}/api/posts/${post.id}`, {  // ✅ added /api
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

  const profilePic = post.profilePic?.startsWith("http")
    ? post.profilePic
    : API_URL + (post.profilePic || "/img1.png");
  const postImg = post.img ? API_URL + post.img : null;

  const handleCommentAddedLocal = (newCount) => {
    setCommentsCount(newCount);
    if (onCommentAdded) onCommentAdded(post.id, newCount);
  };

  return (
    <div className="post">
      <div className="container">
        {/* USER INFO */}
        <div className="user">
          <div className="userInfo">
            <img src={profilePic} alt="profile" />
            <div className="details">
              <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{timeAgo(post.created_at)}</span>
            </div>
          </div>
          <div className="menu" ref={menuRef}>
            <MoreHorizIcon onClick={() => setMenuOpen((prev) => !prev)} />
            {menuOpen && (
              <div className="dropdownMenu">
                <span>Report</span>
                <span>Copy Link</span>
                {currentUser?.id === post.userId && (
                  <span onClick={handleDelete} style={{ color: "red" }}>Delete</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* POST CONTENT */}
        <div className="content">
          <p>{post.desc}</p>
          {postImg && <img src={postImg} alt="post" />}
        </div>

        {/* POST ACTIONS */}
        <div className="info">
          <div className="item" onClick={handleToggleLike}>
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {likesCount} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsCount} Comments
          </div>
          <div className="item" onClick={handleShare}>
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {/* SHARE POPUP */}
        {shareOpen && (
          <div className="sharePopup" ref={shareRef}>
            <div className="shareItem" onClick={handleCopyLink}>
              <img src={linkIcon} alt="Copy Link" />
              Copy Link
            </div>
            <div className="shareItem" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, "_blank")}>
              <img src={whatsappIcon} alt="WhatsApp" />
              WhatsApp
            </div>
            <div className="shareItem" onClick={() => window.open(`mailto:?subject=Check this post&body=${encodeURIComponent(postUrl)}`)}>
              <img src={gmailIcon} alt="Gmail" />
              Gmail
            </div>
            <div className="shareItem" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(postUrl)}`, "_blank")}>
              <img src={telegramIcon} alt="Telegram" />
              Telegram
            </div>
          </div>
        )}

        {commentOpen && <Comments postId={post.id} onCommentAdded={handleCommentAddedLocal} />}
      </div>
    </div>
  );
};

export default Post;
