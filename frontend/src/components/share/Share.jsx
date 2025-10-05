import "./share.scss";
import Image from "../../assets/images/img.png";
import Map from "../../assets/images/loc.png";
import Friend from "../../assets/images/tag.png";
import ProfileFallback from "../../assets/images/img1.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { API_URL } from "../../axios";

const Share = ({ onPostCreated }) => {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // Utility function to get profile image
  const getProfileImage = (user) => {
    if (!user) return ProfileFallback;
    if (user.profile_img?.startsWith("/uploads/")) return `${API_URL}${user.profile_img}`;
    return user.profile_img || ProfileFallback;
  };

  const handleShare = async () => {
    if (!desc.trim() && !file) return;
    setLoading(true);

    try {
      let imgUrl = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imgUrl = res.data.fileUrl;
      }

      const postRes = await axios.post(`${API_URL}/api/posts`, {
        user_id: currentUser.id,
        desc_text: desc,
        img_url: imgUrl,
      });

      const newPost = {
        ...postRes.data, // backend already returns full post
        profilePic: currentUser.profile_img, // will use dynamic profile image
        name: currentUser.name,
      };

      setDesc("");
      setFile(null);
      setPreview(null);

      if (onPostCreated) onPostCreated(newPost);
    } catch (err) {
      console.error("Failed to share post:", err.response?.data || err.message);
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={getProfileImage(currentUser)} alt={currentUser?.name || "User"} />
          <input
            type="text"
            placeholder={`What's on your mind ${currentUser?.name || "User"}?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {preview && (
          <div className="preview">
            <img src={preview} alt="preview" />
            <button onClick={() => { setFile(null); setPreview(null); }}>Remove</button>
          </div>
        )}

        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="add" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="location" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="tag" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button
              onClick={handleShare}
              disabled={loading || (!desc.trim() && !file)}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
