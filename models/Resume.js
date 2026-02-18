const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: String,
  summary: String,
  educationList: [
    {
      degree: String,
      college: String,
      year: String,
    },
  ],
  experienceList: [
    {
      role: String,
      company: String,
      duration: String,
      description: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);
