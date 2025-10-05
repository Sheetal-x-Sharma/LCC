import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool;

export const connectDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
          rejectUnauthorized: false, // allow self-signed certs
        },
        waitForConnections: true,
        connectionLimit: 10, // max 10 concurrent connections
        queueLimit: 0,
      });
      console.log("✅ MySQL pool created");
    }
    return pool;
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
};
