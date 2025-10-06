import "./ownProfile.scss";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Posts from "../../components/posts/Posts";
import Profileimg from "../../assets/images/img1.png";
import Cover from "../../assets/images/mountain.png";

const OwnProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const menuRef = useRef(null);

  // Editable fields
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // ------------------ FETCH USER DATA ------------------
  useEffect(() => {
    if (!currentUser) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${currentUser.id}`, {
          withCredentials: true,
        });
        setUser(res.data);
        setBio(res.data.bio || "");
        setAbout(res.data.about || "");
        setWebsite(res.data.personal_website || "");
        setLocation(res.data.city || "");
        setFacebook(res.data.facebook_url || "");
        setInstagram(res.data.instagram_url || "");
        setLinkedin(res.data.linkedin_url || "");
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
    fetchUser();
  }, [currentUser, API_BASE]);

  // ------------------ SAVE EDITED PROFILE ------------------
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("about", about);
      formData.append("personal_website", website);
      formData.append("city", location);
      formData.append("facebook_url", facebook);
      formData.append("instagram_url", instagram);
      formData.append("linkedin_url", linkedin);
      if (profileFile) formData.append("profile_img", profileFile);
      if (coverFile) formData.append("cover_img", coverFile);

      await axios.put(`${API_BASE}/users/${currentUser.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setEditing(false);

      const updated = await axios.get(`${API_BASE}/users/${currentUser.id}`, {
        withCredentials: true,
      });
      setUser(updated.data);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  if (!user) return <div>Loading profile...</div>;

  // ✅ Helper to handle both Cloudinary and local images
  const resolveImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith("http")) return path; // Cloudinary or any external URL
    return API_BASE.replace("/api", "") + path; // Local backend upload
  };

  const getProfileImg = () => {
    if (profileFile) return URL.createObjectURL(profileFile);
    return resolveImageUrl(user.profile_img, Profileimg);
  };

  const getCoverImg = () => {
    if (coverFile) return URL.createObjectURL(coverFile);
    return resolveImageUrl(user.cover_img, Cover);
  };

  return (
    <div className="profile">
      {/* Cover + Profile Images */}
      <div className="images">
        <img src={getCoverImg()} alt="Cover" className="cover" />
        {editing && (
          <>
            <label htmlFor="coverUpload" className="coverUploadLabel">
              <CameraAltIcon />
            </label>
            <input
              id="coverUpload"
              type="file"
              accept="image/*"
              className="coverUpload"
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
          </>
        )}

        <img src={getProfileImg()} alt="Profile" className="profilePic" />
        {editing && (
          <>
            <label htmlFor="profileUpload" className="profileUploadLabel">
              <CameraAltIcon />
            </label>
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              className="profileUpload"
              onChange={(e) => setProfileFile(e.target.files[0])}
            />
          </>
        )}
      </div>

      {/* Profile Content */}
      <div className="profileContainer">
        <div className="uInfo">
          {/* Left: Social Icons */}
          <div className="left">
            {editing ? (
              <div className="socialInputs">
                <input
                  placeholder="Facebook URL"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
                <input
                  placeholder="Instagram URL"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <input
                  placeholder="LinkedIn URL"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            ) : (
              <div className="socialIcons">
                {facebook && (
                  <a href={facebook} target="_blank" rel="noreferrer">
                    <FacebookTwoToneIcon fontSize="large" />
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noreferrer">
                    <InstagramIcon fontSize="large" />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer">
                    <LinkedInIcon fontSize="large" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Center Info */}
          <div className="center">
            <span>{user.name}</span>
            <div className="batch">Batch: {user.batch || "N/A"}</div>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                {editing ? (
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                ) : (
                  <span>{user.city || "N/A"}</span>
                )}
              </div>
              <div className="item">
                <LanguageIcon />
                {editing ? (
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                ) : (
                  <span>{user.personal_website || "N/A"}</span>
                )}
              </div>
            </div>

            {/* Bio */}
            {editing ? (
              <textarea
                placeholder="Write a short bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            ) : (
              <div className="bio">{user.bio || "No bio added yet."}</div>
            )}

            <button onClick={editing ? handleSave : () => setEditing(true)}>
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* Right: Email */}
          <div className="right">
            <a href={`mailto:${user.email}`}>
              <EmailOutlinedIcon />
            </a>
          </div>

          {/* Stats */}
          <div className="stats">
            <span>
              <strong>{user.posts_count || 0}</strong>
              <br />
              Posts
            </span>
            <span>
              <strong>{user.followers_count || 0}</strong>
              <br />
              Followers
            </span>
            <span>
              <strong>{user.following_count || 0}</strong>
              <br />
              Following
            </span>
            <span>
              <strong>{user.dedications_count || 0}</strong>
              <br />
              Dedications
            </span>
          </div>
        </div>

        {/* About Section */}
        <div className="about">
          <h3>About</h3>
          {editing ? (
            <textarea
              className="aboutEdit"
              placeholder="Tell us more about yourself..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          ) : (
            <p>{user.about || "No description added yet."}</p>
          )}
        </div>

        {/* User's Posts */}
        <Posts userId={currentUser?.id} />
      </div>
    </div>
  );
};

export default OwnProfile;
