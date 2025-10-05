import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { pool } from "../connect.js";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Google Login
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email.endsWith("@lnmiit.ac.in")) {
      return res
        .status(403)
        .json({ message: "Only LNMIIT email addresses are allowed." });
    }

    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    let user;
    let isNewUser = false;

    if (rows.length === 0) {
      const [result] = await pool.execute(
        `INSERT INTO users (
          google_id, name, email, profile_img, 
          user_type, batch, company_name, role, 
          city, state, country, department, designation, 
          linkedin_url, github_url, instagram_url, facebook_url, personal_website, 
          bio, about, cover_img
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sub,
          name,
          email,
          picture,
          "student",
          null,
          null,
          null,
          "Jaipur",
          "Rajasthan",
          "India",
          null,
          null,
          null,
          null,
          null,
          null,
          "New user at LNMIIT Campus Connect!",
          null,
          null,
        ]
      );

      user = {
        id: result.insertId,
        google_id: sub,
        name,
        email,
        profile_img: picture,
      };
      isNewUser = true;
    } else {
      user = rows[0];
    }

    const tokenJWT = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access_token", tokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // must be true for SameSite=None
      sameSite: "none", // cross-site requests now work
    });

    res.status(200).json({
      token: tokenJWT,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_img: user.profile_img,
      },
      isNewUser,
    });
  } catch (error) {
    console.error("Google login error:", error.sqlMessage || error.message);
    return res.status(500).json({
      message: "Google login failed",
      error: error.sqlMessage || error.message,
    });
  }
};

// ✅ Complete Register (Profile Update)
export const completeRegister = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;
    const {
      user_type, batch, company_name, role, city, state, country,
      department, designation, linkedin_url, github_url,
      instagram_url, facebook_url, personal_website, bio, about,
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE users 
       SET user_type=?, batch=?, company_name=?, role=?, city=?, state=?, country=?, 
           department=?, designation=?, linkedin_url=?, github_url=?, instagram_url=?, 
           facebook_url=?, personal_website=?, bio=?, about=?
       WHERE id=?`,
      [
        user_type, batch, company_name, role, city, state, country,
        department, designation, linkedin_url, github_url,
        instagram_url, facebook_url, personal_website, bio, about,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get Current User
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("GetMe error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // cross-origin logout
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
