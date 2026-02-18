const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/ai", require("./routes/aiRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
