import "./login.scss";
import { useState, useContext } from "react";
import Register from "../../components/register/Register";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ✅ Handle Google login success
 const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const googleIdToken = credentialResponse.credential; // ✅ Google token

  const res = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
  { token: googleIdToken },   // ✅ correct key name
  { withCredentials: true }
);



    const { token: jwtToken, user, isNewUser } = res.data;

    // ✅ Save BOTH tokens in context
    login(user, jwtToken, googleIdToken);

    if (isNewUser) {
      setUser(user);
      setShowRegister(true);
    } else {
      navigate("/");
    }
  } catch (err) {
    console.error("Google login error:", err);
    alert(err.response?.data?.message || "Google login failed");
  }
};

  // ✅ Handle Google login failure
  const handleGoogleFailure = () => {
    alert("Google Login Failed. Try again.");
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    navigate("/");
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <div className="image-overlay"></div>
          <h1>
            <span className="welcome-text">Welcome</span> to
            <br />
            LNMIIT Campus Connect.
          </h1>
          <p>
            An exclusive platform for LNMIIT students, alumni, and faculty.
            Stay connected, explore opportunities, and build meaningful
            relationships — all in one place.
          </p>
        </div>

        <div className="right">
          <h1>
            <span className="welcome-text">Enter. Engage. Excel.</span>
          </h1>
          <p>Use your LNMIIT email to continue</p>

          <div className="login-button">
            <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleFailure}
  width="300px"
  useOneTap={false}       // ❌ disable One Tap
  auto_select={false}     // ❌ no silent auto-login
  prompt="select_account" // ✅ always force account chooser/password
/>

          </div>

          <span className="newto">
            New to LNMIIT Campus Connect?
            <br />
            <a href="mailto:admin@lnmiit.ac.in" className="adminLink">
              Contact admin
            </a>
          </span>
        </div>
      </div>

      {showRegister && (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onClose={() => setShowRegister(false)}
        />
      )}
    </div>
  );
};

export default Login;
