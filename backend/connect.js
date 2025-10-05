// backend/connect.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// ✅ Create a connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // adjust as needed
  queueLimit: 0,
});

// Optional: test connection
pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL pool connected");
    conn.release();
  })
  .catch(err => console.error("❌ MySQL pool connection failed:", err.message));
