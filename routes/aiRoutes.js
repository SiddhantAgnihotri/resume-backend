const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const authMiddleware = require("../middleware/authMiddleware");


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate-summary",authMiddleware, async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { skills } = req.body;

    if (!skills || skills.trim() === "") {
      return res.status(400).json({ error: "Skills required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",   // ✅ Using cheaper model
      messages: [
        {
          role: "system",
          content: "You are a professional resume writing assistant.",
        },
        {
          role: "user",
          content: `Write a strong professional resume summary using these skills: ${skills}. Keep it 3-4 lines and professional.`,
        },
      ],
      max_tokens: 200,   // ✅ Limits cost
    });

    const summary = completion.choices[0].message.content;

    res.status(200).json({ summary });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
