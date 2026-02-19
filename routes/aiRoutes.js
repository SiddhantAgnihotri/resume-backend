const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const authMiddleware = require("../middleware/authMiddleware");
const aiLimiter = require("../middleware/aiLimiter");


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate-summary",authMiddleware,aiLimiter, async (req, res) => {
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

router.post("/improve-experience", authMiddleware,aiLimiter, async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writing assistant.",
        },
        {
          role: "user",
          content: `Rewrite this job experience professionally with strong action verbs and measurable impact: ${description}`,
        },
      ],
      max_tokens: 250,
    });

    res.json({
      improved: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI Improve Error:", error.message);
    res.status(500).json({ error: "AI failed" });
  }
});

router.post("/analyze-resume", authMiddleware, aiLimiter, async (req, res) => {
  try {
    const { name, skills, summary, experienceList } = req.body;

    const prompt = `
    Analyze this resume and give:
    1. Overall score out of 100
    2. Strengths (3 bullet points)
    3. Weaknesses (3 bullet points)
    4. Suggestions for improvement

    Resume Data:
    Name: ${name}
    Skills: ${skills}
    Summary: ${summary}
    Experience: ${JSON.stringify(experienceList)}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an ATS resume expert." },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
    });

    res.json({
      analysis: completion.choices[0].message.content,
    });

  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
});


router.post("/job-match", authMiddleware, aiLimiter, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    const prompt = `
    Compare this resume with the job description.
    Give:
    1. Match percentage
    2. Missing keywords
    3. Improvement suggestions

    Resume: ${JSON.stringify(resumeData)}
    Job Description: ${jobDescription}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an ATS optimization expert." },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
    });

    res.json({
      matchAnalysis: completion.choices[0].message.content,
    });

  } catch (error) {
    res.status(500).json({ error: "Job match failed" });
  }
});


router.post("/generate-cover-letter", authMiddleware, aiLimiter, async (req, res) => {
  try {
    const { resumeData, jobTitle, companyName } = req.body;

    const prompt = `
    Write a professional cover letter for:

    Job Title: ${jobTitle}
    Company: ${companyName}
    Resume Data: ${JSON.stringify(resumeData)}

    Keep it professional and impactful.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional cover letter writer." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    });

    res.json({
      coverLetter: completion.choices[0].message.content,
    });

  } catch (error) {
    res.status(500).json({ error: "Cover letter failed" });
  }
});


module.exports = router;
