import { NavLink } from "react-router-dom"; // ✅ Use NavLink
import { useState } from "react";
import "./settings.scss";




const Settings = () => {
  const [openSection, setOpenSection] = useState(null);




  // Toggle function to open/close dropdown
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };




  return (
    <div className="super">
    <div className="settings">
      <h2>Settings</h2>




      {/* Profile Settings */}
      <div className="setting-item" onClick={() => toggleSection("profile")}>
        <div className="setting-title">
          Profile Settings <span>{openSection === "profile" ? "▲" : "▼"}</span>
        </div>
        {openSection === "profile" && (
          <div className="setting-dropdown">
            <button className="update-btn">Update Profile</button>
          </div>
        )}
      </div>




      {/* Privacy Settings */}
      <div className="setting-item" onClick={() => toggleSection("privacy")}>
        <div className="setting-title">
          Privacy Settings <span>{openSection === "privacy" ? "▲" : "▼"}</span>
        </div>
        {openSection === "privacy" && (
          <div className="setting-dropdown">
                <button className="update-btn">Blocked Users List</button>
          </div>
        )}
      </div>




      {/* Notification Settings */}
      <div className="setting-item" onClick={() => toggleSection("notifications")}>
        <div className="setting-title">
          Notification Settings <span>{openSection === "notifications" ? "▲" : "▼"}</span>
        </div>
        {openSection === "notifications" && (
          <div className="setting-dropdown">
            <label>
                Mute Notifications
            </label>
          </div>
        )}
      </div>




      {/* Theme & Appearance */}
      <div className="setting-item" onClick={() => toggleSection("theme")}>
        <div className="setting-title">
          Theme & Appearance <span>{openSection === "theme" ? "▲" : "▼"}</span>
        </div>
        {openSection === "theme" && (
          <div className="setting-dropdown">
            <button className="theme-toggle">Toggle Light/Dark Mode</button>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="setting-item">
        <NavLink to ="/login">
        <button className="logout-btn">Logout</button>
        </NavLink>
      </div>
    </div>
    </div>
  );
};




export default Settings;
















