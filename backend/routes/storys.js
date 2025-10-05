// routes/stories.js
import express from "express";
const router = express.Router();

// Dummy stories
const stories = [
  { id: 1, name: "John Doe", img: "/mountain.png" },
  { id: 2, name: "Jane Doe", img: "/mountain.png" },
];

// GET all stories
router.get("/", (req, res) => {
  res.json(stories);
});

export default router;
