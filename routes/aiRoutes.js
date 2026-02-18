const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate-summary", async (req, res) => {
  try {
    console.log("Incoming Body:", req.body);

    const { skills } = req.body;

    if (!skills || skills.trim() === "") {
      return res.status(400).json({ error: "Skills are required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Write a professional resume summary using these skills: ${skills}. Keep it 3-4 lines.`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;

    console.log("AI Generated Summary:", summary);

    res.status(200).json({ summary });

  } catch (error) {
    console.error("AI ERROR FULL:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
