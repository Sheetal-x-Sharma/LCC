// Register.jsx
import { useState, useContext } from "react";
import "./register.scss";
import axios, { API_URL } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Register = ({ onClose, onRegisterSuccess }) => {
  const { token } = useContext(AuthContext);

  const [userType, setUserType] = useState("student");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    company_name: "",
    role: "",
    city: "",
    state: "",
    country: "",
    department: "",
    designation: "",
    linkedin_url: "",
    github_url: "",
    instagram_url: "",
    facebook_url: "",
    personal_website: "",
    bio: "",
    about: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      return alert("You must accept the Terms and Conditions to proceed.");
    }

    try {
      await axios.post(
        "/auth/register",
        { ...formData, user_type: userType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile completed successfully!");
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-modal-wrapper">
      <div className="register-modal">
        <div className="register-content">
          <div className="register-header">
            <h2>Complete Your Profile</h2>
            <span className="back-button" onClick={onClose}>← Back</span>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Name <span>*</span></label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>User Type <span>*</span></label>
            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              <option value="faculty">LNMIIT Faculty</option>
              <option value="other">Other</option>
            </select>

            <label>Location <span>*</span></label>
            <div className="location-row">
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
              <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
              <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
            </div>

            {userType === "student" && (
              <>
                <label>Batch <span>*</span></label>
                <input type="text" name="batch" placeholder="eg. 2022" value={formData.batch} onChange={handleChange} required />
              </>
            )}

            {userType === "alumni" && (
              <>
                <label>Batch <span>*</span></label>
                <input type="text" name="batch" placeholder="eg. 2017" value={formData.batch} onChange={handleChange} required />
                <label>Company Name</label>
                <input type="text" name="company_name" placeholder="Your current company" value={formData.company_name} onChange={handleChange} />
                <label>Role</label>
                <input type="text" name="role" placeholder="Your current role" value={formData.role} onChange={handleChange} />
              </>
            )}

            {(userType === "faculty" || userType === "other") && (
              <>
                <label>Department <span>*</span></label>
                <input type="text" name="department" placeholder="Enter department" value={formData.department} onChange={handleChange} required />
                <label>Designation <span>*</span></label>
                <input type="text" name="designation" placeholder="Your designation" value={formData.designation} onChange={handleChange} required />
              </>
            )}

            <label>LinkedIn</label>
            <input type="url" name="linkedin_url" placeholder="https://linkedin.com/in/yourname" value={formData.linkedin_url} onChange={handleChange} />

            <label>GitHub</label>
            <input type="url" name="github_url" placeholder="https://github.com/yourname" value={formData.github_url} onChange={handleChange} />

            <label>Instagram</label>
            <input type="url" name="instagram_url" placeholder="https://instagram.com/yourprofile" value={formData.instagram_url} onChange={handleChange} />

            <label>Facebook</label>
            <input type="url" name="facebook_url" placeholder="https://facebook.com/yourprofile" value={formData.facebook_url} onChange={handleChange} />

            <label>Personal Website</label>
            <input type="url" name="personal_website" placeholder="https://yourwebsite.com" value={formData.personal_website} onChange={handleChange} />

            <label>Bio <span>*</span></label>
            <textarea name="bio" placeholder="Write a short bio..." value={formData.bio} onChange={handleChange} required></textarea>

            <label>About</label>
            <textarea name="about" placeholder="Tell us more about you (optional)" value={formData.about} onChange={handleChange}></textarea>

            <div className="terms">
              <input type="checkbox" id="terms" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
              <label htmlFor="terms" className="terms-label">
                I accept the <a href="#">Terms and Conditions</a> <span>*</span>
              </label>
            </div>

            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
