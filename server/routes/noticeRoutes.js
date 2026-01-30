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

// Update a notice/event (admin only)
router.put("/:id", async (req, res) => {
  const { title, content, type, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, content, type },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Notice not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a notice/event (admin only)
router.delete("/:id", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Notice not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
