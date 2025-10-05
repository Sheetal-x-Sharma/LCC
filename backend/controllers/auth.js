import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { pool } from "../connect.js";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "No Google token provided" });
  }

  try {
    console.log("Google token received:", token);

    // ✅ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      console.error("Google token payload is empty");
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name, picture, sub } = payload;
    console.log("Google payload:", payload);

    // ✅ LNMIIT email check
    if (!email.endsWith("@lnmiit.ac.in")) {
      return res
        .status(403)
        .json({ message: "Only LNMIIT email addresses are allowed." });
    }

    // ✅ Check if user exists
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log("Existing users found:", rows.length);

    let user;
    let isNewUser = false;

    // ✅ Insert new user if not exists
    if (rows.length === 0) {
      const [result] = await pool.execute(
        `INSERT INTO users (
          google_id, name, email, profile_img, user_type, batch, company_name, role,
          city, state, country, department, designation,
          linkedin_url, github_url, instagram_url, facebook_url, personal_website,
          bio, about, cover_img
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sub,
          name,
          email,
          picture || null,
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

      console.log("New user inserted with ID:", result.insertId);

      user = {
        id: result.insertId,
        google_id: sub,
        name,
        email,
        profile_img: picture || null,
      };
      isNewUser = true;
    } else {
      user = rows[0];
      console.log("Existing user:", user);
    }

    // ✅ Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const tokenJWT = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("JWT token created for user:", user.id);

    // ✅ Set cookie
    res.cookie("access_token", tokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
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
    console.error(
      "Google login error:",
      error.sqlMessage || error.message || error
    );
    res.status(500).json({
      message: "Google login failed",
      error: error.sqlMessage || error.message || error,
    });
  }
};
