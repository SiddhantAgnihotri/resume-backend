const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");


// Save Resume
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      userId: req.user.id,
    });

    await resume.save();
    res.json({ message: "Resume saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save resume" });
  }
});


// Get All Resumes
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

module.exports = router;
