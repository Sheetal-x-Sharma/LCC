import { useContext, useState, useEffect, useRef } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import API, { API_URL } from "../../axios";
import upload from "../../assets/images/upload.png";

const Stories = () => {
  const { currentUser, token } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await API.get("/stories", { headers: { Authorization: "Bearer " + token } });
      setStories(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleTypeSelect = (type) => {
    setMediaType(type);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Upload + save to DB in one go
      await API.post("/stories", formData, {
        headers: { Authorization: "Bearer " + token },
      });

      fetchStories();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }
  };

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });

  return (
    <div className="stories-wrapper">
      <button className="scroll-btn left" onClick={scrollLeft}>&#10094;</button>

      <div className="stories" ref={scrollRef}>
        {/* Add Story Card */}
        {/* Add Story Card */}
<div className="story" onClick={handleOpenModal}>
  <img 
    src={currentUser.profile_img ? `${API_URL}${currentUser.profile_img}` : "/default.png"} 
    alt={currentUser.name} 
  />
  <span>{currentUser.name}</span>
  <img src={upload} alt="upload" />
</div>

        {/* Render stories */}
        {loading
          ? "Loading stories..."
          : stories.map((story) => (
              <div className="story" key={story.id}>
                {story.media_type === "video" ? (
                  <video src={`${API_URL}${story.img_url}`} controls preload="metadata" />
                ) : (
                  <img src={`${API_URL}${story.img_url}`} alt="" />
                )}
                <span>{story.name}</span>
              </div>
            ))}
      </div>

      <button className="scroll-btn right" onClick={scrollRight}>&#10095;</button>

      {showModal && (
        <div className="story-modal">
          <div className="modal-content">
            <h3>Add Story</h3>
            <div className="type-buttons">
              <button className={mediaType === "image" ? "active" : ""} onClick={() => handleTypeSelect("image")}>Image</button>
              <button className={mediaType === "video" ? "active" : ""} onClick={() => handleTypeSelect("video")}>Video</button>
            </div>

            <input type="file" accept={mediaType + "/*"} style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
            <button onClick={() => fileInputRef.current.click()}>Browse {mediaType}</button>

            {previewUrl && (mediaType === "video" ? (
              <video src={previewUrl} controls className="preview" />
            ) : (
              <img src={previewUrl} alt="preview" className="preview" />
            ))}

            <div className="buttons">
              <button onClick={handleUpload}>Upload</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
