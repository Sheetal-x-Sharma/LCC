import "./rightBar.scss";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext.jsx";
import API, { API_URL } from "../../axios.js";
import ProfileFallback from "../../assets/images/profile.png";
import img1 from "../../assets/images/img1.png";
import img2 from "../../assets/images/img2.png";

const RightBar = () => {
  const { currentUser, token } = useContext(AuthContext);
  const [latestActivities, setLatestActivities] = useState([]);

  // Fetch latest notifications (excluding self)
  useEffect(() => {
    const fetchActivities = async () => {
      if (!token) return;
      try {
        const res = await API.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLatestActivities(res.data);
      } catch (err) {
        console.error("Failed to fetch latest activities:", err);
      }
    };
    fetchActivities();
  }, [token]);

  const getProfileImage = (img) => {
    if (!img) return ProfileFallback;
    if (img.includes("lh3.googleusercontent.com")) {
      return `${API_URL}/api/proxy-image?url=${encodeURIComponent(img)}`;
    }
    if (img.startsWith("/uploads/")) {
      return `${API_URL}${img}`;
    }
    return img;
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions Section (static dummy data) */}
        <div className="item">
          <span>Suggestions For You</span>

          <div className="user">
            <Link to="/profile/jimmybert" className="userInfo">
              <img src={img1} alt="image1" />
              <span>Jimmy Bert</span>
            </Link>
            <div className="buttons">
              <button>Follow</button>
              <button>Dismiss</button>
            </div>
          </div>

          <div className="user">
            <Link to="/profile/himanidesooza" className="userInfo">
              <img src={img2} alt="image2" />
              <span>Himani Desooza</span>
            </Link>
            <div className="buttons">
              <button>Follow</button>
              <button>Dismiss</button>
            </div>
          </div>
        </div>

        {/* Latest Activities Section (dynamic) */}
        <div className="item">
          <span>Latest Activities</span>

          {latestActivities.length === 0 ? (
            <p style={{ color: "#888", fontSize: "14px" }}>No recent activity</p>
          ) : (
            latestActivities.map((activity) => (
              <div className="user" key={activity.id}>
                <Link
                  to={`/ownProfile/${activity.actor_id}`}
                  className="userInfo"
                >
                  <img
                    src={getProfileImage(activity.actor_profile)}
                    alt={activity.actor_name || "User"}
                  />
                  <p>
                    <span>{activity.actor_name}</span> posted something
                  </p>
                </Link>
                <span>{formatTimeAgo(activity.created_at)}</span>
              </div>
            ))
          )}
        </div>

        {/* Online Friends Section (static dummy data for now) */}
        <div className="item">
          <span>Online Friends</span>

          <div className="user">
            <Link to="/profile/himanidesooza" className="userInfo">
              <img src={img2} alt="image2" />
              <div className="online" />
              <span>Himani Desooza</span>
            </Link>
          </div>

          <div className="user">
            <Link to="/profile/himanidesooza" className="userInfo">
              <img src={img2} alt="image2" />
              <div className="online" />
              <span>Himani Desooza</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
