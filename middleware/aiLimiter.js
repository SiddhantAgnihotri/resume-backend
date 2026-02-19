const User = require("../models/User");

module.exports = async function (req, res, next) {
  const user = await User.findById(req.user.id);

  const today = new Date().toDateString();
  const lastUsageDate = new Date(user.aiUsageDate).toDateString();

  if (today !== lastUsageDate) {
    user.aiUsage = 0;
    user.aiUsageDate = new Date();
  }

  if (user.aiUsage >= 100) {
    return res.status(403).json({
      error: "Daily AI limit reached (10 requests)",
    });
  }

  user.aiUsage += 1;
  await user.save();

  next();
};
