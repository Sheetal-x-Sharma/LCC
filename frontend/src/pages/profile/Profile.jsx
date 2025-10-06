import "./profile.scss";
import { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import Cover from "../../assets/images/mountain.png";
import Profileimg from "../../assets/images/img1.png";
import { AuthContext } from "../../context/authContext.jsx";

const Profile = () => {
  const { id } = useParams();
  const { currentUser, token } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const menuRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // ------------------ FETCH USER ------------------
  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/${id}`, { withCredentials: true });
      setUser(res.data || {});
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser({});
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id, API_BASE]);

  // ------------------ FETCH POSTS COUNT ------------------
  useEffect(() => {
    const fetchPostsCount = async () => {
      try {
        const res = await axios.get(`${API_BASE}/posts?userId=${id}`, { withCredentials: true });
        setPostsCount(res.data?.length || 0);
      } catch (err) {
        console.error("Error fetching posts count:", err);
      }
    };
    fetchPostsCount();
  }, [id, API_BASE]);

  // ------------------ FETCH FOLLOWING STATUS ------------------
  useEffect(() => {
    if (!currentUser) return;
    const checkFollowingStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE}/followers/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowing(res.data?.following || false);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };
    checkFollowingStatus();
  }, [id, currentUser, token, API_BASE]);

  // ------------------ HANDLE FOLLOW / UNFOLLOW ------------------
  const handleFollowToggle = async () => {
    if (!currentUser) return alert("Login first to follow users!");
    try {
      let updatedUser = { ...user };

      if (following) {
        await axios.delete(`${API_BASE}/followers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setFollowing(false);
        updatedUser.followers_count = Math.max(0, (updatedUser.followers_count || 1) - 1);
      } else {
        await axios.post(
          `${API_BASE}/followers`,
          { followingId: id },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setFollowing(true);
        updatedUser.followers_count = (updatedUser.followers_count || 0) + 1;
      }

      setUser(updatedUser);
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  // ------------------ CLOSE DROPDOWN ON OUTSIDE CLICK ------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return <div>Loading profile...</div>;

  // ✅ Helper: handles both Cloudinary & local URLs
  const resolveImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith("http")) return path; // already full Cloudinary URL
    return API_BASE.replace("/api", "") + path; // local uploads
  };

  const profileImgUrl = resolveImageUrl(user.profile_img, Profileimg);
  const coverImgUrl = resolveImageUrl(user.cover_img, Cover);

  return (
    <div className="profile">
      <div className="images">
        <img src={coverImgUrl} alt="Cover" className="cover" />
        <img src={profileImgUrl} alt="Profile" className="profilePic" />
      </div>

      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href={user.facebook_url || "http://facebook.com"} target="_blank" rel="noreferrer">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href={user.instagram_url || "https://www.instagram.com/"} target="_blank" rel="noreferrer">
              <InstagramIcon fontSize="large" />
            </a>
            <a href={user.linkedin_url || "https://linkedin.com"} target="_blank" rel="noreferrer">
              <LinkedInIcon fontSize="large" />
            </a>
          </div>

          <div className="center">
            <span>{user.name || "Unknown User"}</span>
            <div className="batch">Batch: {user.batch || "N/A"}</div>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{user.city || "Unknown"}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{user.personal_website || "No website"}</span>
              </div>
            </div>
            <div className="bio">{user.bio || "No bio available."}</div>
            <div className="actionButtons">
              <button onClick={handleFollowToggle}>
                {following ? "Following" : "Follow"}
              </button>
              <button>Message</button>
            </div>
          </div>

          <div className="right">
            <a href={`mailto:${user.email || ""}`}><EmailOutlinedIcon /></a>
            <div className="menuContainer" ref={menuRef}>
              <MoreVertIcon onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: "pointer" }} />
              {menuOpen && (
                <div className="dropdownMenu">
                  <span onClick={handleFollowToggle}>{following ? "Unfollow" : "Follow"}</span>
                  <span onClick={() => setBlocked(!blocked)}>{blocked ? "Unblock" : "Block"}</span>
                  <span onClick={() => setMuted(!muted)}>{muted ? "Unmute" : "Mute"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="stats">
            <span><strong>{postsCount}</strong><br />Posts</span>
            <span><strong>{user.followers_count || 0}</strong><br />Followers</span>
            <span><strong>{user.following_count || 0}</strong><br />Following</span>
            <span><strong>{user.dedications_count || 0}</strong><br />Dedications</span>
          </div>
        </div>

        <div className="about">
          <h3>About</h3>
          <p>{user.about || "This user hasn’t written anything about themselves yet."}</p>
        </div>

        <Posts userId={id} />
      </div>
    </div>
  );
};

export default Profile;
