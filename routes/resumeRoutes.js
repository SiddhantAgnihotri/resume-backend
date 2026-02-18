const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");

// Save Resume
router.post("/save", async (req, res) => {
  try {
    const resume = new Resume(req.body);
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
