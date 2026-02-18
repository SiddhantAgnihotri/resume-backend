const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");


// ================= SAVE RESUME =================
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      userId: req.user.id,
    });

    await resume.save();

    res.status(200).json({
      message: "Resume saved successfully",
      resume,
    });

  } catch (error) {
    console.error("Save Resume Error:", error.message);
    res.status(500).json({ error: "Failed to save resume" });
  }
});


// ================= GET LOGGED-IN USER RESUMES =================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(resumes);

  } catch (error) {
    console.error("Fetch Resume Error:", error.message);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});


// ================= DELETE RESUME =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });

  } catch (error) {
    console.error("Delete Resume Error:", error.message);
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

// ================= UPDATE RESUME =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedResume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(updatedResume);

  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Failed to update resume" });
  }
});


module.exports = router;
