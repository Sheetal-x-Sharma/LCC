// LeftBar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import "./leftBar.scss";
import ProfileFallback from "../../assets/images/profile.png";
import Friends from "../../assets/images/friends.png";
import Groups from "../../assets/images/groups.png";
import Events from "../../assets/images/events.png";
import Chat from "../../assets/images/chat.png";
import HallOfFame from "../../assets/images/hallOfFame.png";
import Map from "../../assets/images/map.png";
import Marketplace from "../../assets/images/marketplace.png";
import Settings from "../../assets/images/settings.png";
import Logout from "../../assets/images/logout.png";
import HatDedication from "../../assets/images/hatDedication.png";
import OurTeam from "../../assets/images/ourTeam.png";
import { AuthContext } from "../../context/authContext";
import { API_URL } from "../../axios.js";

const LeftBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  // ✅ Safe image utility
  const getProfileImage = (user) => {
    if (!user || !user.profile_img || user.profile_img === "null" || user.profile_img === "undefined") {
      return ProfileFallback;
    }

    const img = user.profile_img;

    // Google profile images
    if (img.includes("lh3.googleusercontent.com")) {
      return `${API_URL}/api/proxy-image?url=${encodeURIComponent(img)}`;
    }

    // Uploaded image from backend
    if (img.startsWith("/uploads/")) {
      return `${API_URL}${img}`;
    }

    // Already absolute or fallback
    return img || ProfileFallback;
  };

  const profileImage = getProfileImage(currentUser);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
         {currentUser ? (
  <NavLink to={`/ownProfile/${currentUser.id}`} className="item">
    <img
      src={profileImage}
      alt={currentUser.name}
      className="profile-pic circular"
    />
    <span>{currentUser.name}</span>
  </NavLink>
) : (
  <div
    className="item guest-profile"
    onClick={() => alert("Please login to view your profile")}
    style={{ cursor: "pointer" }}
  >
    <img
      src={profileImage}
      alt="Guest"
      className="profile-pic circular"
    />
    <span>Guest</span>
  </div>
)}


          <NavLink to="/friends" className="item">
            <img src={Friends} alt="friends icon" />
            <span>Friends</span>
          </NavLink>

          <NavLink to="/groups" className="item">
            <img src={Groups} alt="groups icon" />
            <span>Groups</span>
          </NavLink>

          <NavLink to="/events" className="item">
            <img src={Events} alt="events icon" />
            <span>Events</span>
          </NavLink>

          <NavLink to="/chats" className="item">
            <img src={Chat} alt="chat icon" />
            <span>Chats</span>
          </NavLink>

          <NavLink to="/hatDedication" className="item">
            <img src={HatDedication} alt="hat dedication icon" />
            <span>Hat Dedication</span>
          </NavLink>

          <NavLink to="/hallOfFame" className="item">
            <img src={HallOfFame} alt="hall of fame icon" />
            <span>Hall Of Fame</span>
          </NavLink>
        </div>

        <hr />

        <div className="menu">
          <span>Others</span>

          <NavLink to="/alumniMap" className="item">
            <img src={Map} alt="map icon" />
            <span>Alumni Map</span>
          </NavLink>

          <NavLink to="/marketplace" className="item">
            <img src={Marketplace} alt="marketplace icon" />
            <span>Marketplace</span>
          </NavLink>

          <NavLink to="/aboutTeam" className="item">
            <img src={OurTeam} alt="our team icon" />
            <span>Our Team</span>
          </NavLink>

          <NavLink to="/settings" className="item">
            <img src={Settings} alt="settings icon" />
            <span>Settings</span>
          </NavLink>

          <div className="item logout-btn" onClick={handleLogout}>
            <img src={Logout} alt="logout icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
