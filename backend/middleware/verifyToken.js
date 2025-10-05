import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Try to read token from cookie first
    let token = req.cookies?.access_token;

    // Fallback: Authorization header
    if (!token && req.headers["authorization"]) {
      token = req.headers["authorization"].split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // important!
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
