const express = require("express");
const router = express.Router();
const Notice = require("../models/notice");
const User = require("../models/users");

// Get all notices/events
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).populate("postedBy", "name");
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin can post a notice/event
router.post("/", async (req, res) => {
  const { title, content, type, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const newNotice = await Notice.create({ title, content, type, postedBy: userId });
    res.json(newNotice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
