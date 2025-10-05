import { NavLink, Link } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DarkModeContext } from "../../context/darkModeContext.jsx";
import { AuthContext } from "../../context/authContext.jsx";
import API, { API_URL } from "../../axios.js";
import logo from "../../assets/images/logo.png";
import ProfileFallback from "../../assets/images/profile.png";

const Navbar = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser, token } = useContext(AuthContext);

  const [userData, setUserData] = useState(currentUser || null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationsRef = useRef();

  // Fetch latest user details
  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [token]);

  // Fetch notifications
  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.filter((n) => n.actor_id !== userData?.id);
        setNotifications(filtered);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [token, userData]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await API.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    try {
      await API.delete("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // ✅ Safe utility
  const getProfileImage = (user) => {
    if (
      !user ||
      !user.profile_img ||
      user.profile_img === "null" ||
      user.profile_img === "undefined"
    ) {
      return ProfileFallback;
    }

    const img = user.profile_img;

    if (img.includes("lh3.googleusercontent.com")) {
      return `${API_URL}/api/proxy-image?url=${encodeURIComponent(img)}`;
    }

    if (img.startsWith("/uploads/")) {
      return `${API_URL}${img}`;
    }

    return img || ProfileFallback;
  };

  const profileImg = getProfileImage(userData);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" className="icon logo">
          <img src={logo} alt="logo" />
        </Link>

        <NavLink to="/" className="icon">
          <HomeOutlinedIcon />
        </NavLink>

        <div className="icon toggle-theme" onClick={toggle}>
          {darkMode ? <WbSunnyOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </div>

        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search.." />
        </div>
      </div>

      <div className="right">
        {/* Notifications */}
        <div className="notification-icon" ref={notificationsRef}>
          <div
            className="icon-wrapper icon"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <NotificationsOutlinedIcon />
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>

          {notificationsOpen && (
            <div className="notifications-dropdown">
              {notifications.length === 0 ? (
                <div className="no-notifications">No notifications.</div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <div className="notification" key={notification.id}>
                      <span>
                        <b>{notification.actor_name}</b> posted something
                      </span>
                      <CloseIcon
                        className="delete-icon"
                        onClick={() => handleDeleteNotification(notification.id)}
                      />
                    </div>
                  ))}
                  <div className="clear-link" onClick={handleClearAll}>
                    Clear All
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user">
          {userData ? (
            <NavLink to={`/ownProfile/${userData.id}`} className="user-link">
              <img src={profileImg} alt={userData.name || "User"} />
              <span>{userData.name || "User"}</span>
            </NavLink>
          ) : (
            <NavLink to="/login" className="user-link">
              <img src={ProfileFallback} alt="profile" />
              <span>Guest</span>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
