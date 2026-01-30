const express = require("express");
const router = express.Router();
const Maintenance = require("../models/maintenance");
const User = require("../models/users");

router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    if (userId) {
      const requests = await Maintenance.find({ user: userId }).populate("user", "name");
      return res.json(requests);
    }

    const requests = await Maintenance.find().populate("user", "name");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { issue, userId } = req.body;
  const request = await Maintenance.create({ issue, user: userId });
  res.json(request);
});

// Update maintenance request (owner or admin)
router.put("/:id", async (req, res) => {
  const { issue, status, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(403).json({ error: "Access denied" });

    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) return res.status(404).json({ error: "Not found" });

    if (String(maintenance.user) !== String(userId) && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    maintenance.issue = issue ?? maintenance.issue;
    maintenance.status = status ?? maintenance.status;
    await maintenance.save();

    const updated = await Maintenance.findById(req.params.id).populate("user", "name");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete maintenance request (owner or admin)
router.delete("/:id", async (req, res) => {
  console.log("🔥 DELETE /maintenance/:id HIT");
  console.log("➡️ Params:", req.params);
  console.log("➡️ Body:", req.body);
  console.log("➡️ Query:", req.query);
  console.log("➡️ Headers x-user-id:", req.headers["x-user-id"]);

  const userId =
  req.headers["x-user-id"] ||
  req.query.userId ||
  req.body?.userId;

  console.log("✅ Resolved userId:", userId);

  try {
    if (!userId) {
      console.error("❌ No userId provided");
      return res.status(400).json({ error: "userId missing" });
    }

    const user = await User.findById(userId);
    console.log("👤 User found:", user);

    if (!user) {
      console.error("❌ Invalid userId");
      return res.status(403).json({ error: "Access denied" });
    }

    const maintenance = await Maintenance.findById(req.params.id);
    console.log("🛠 Maintenance found:", maintenance);

    if (!maintenance) {
      console.error("❌ Maintenance not found");
      return res.status(404).json({ error: "Not found" });
    }

    console.log("🔐 Owner check:", {
      maintenanceUser: String(maintenance.user),
      requestUser: String(userId),
      role: user.role,
    });

    if (
      String(maintenance.user) !== String(userId) &&
      user.role !== "admin"
    ) {
      console.error("❌ Authorization failed");
      return res.status(403).json({ error: "Access denied" });
    }

    await Maintenance.findByIdAndDelete(req.params.id);
    console.log("✅ Maintenance deleted successfully");

    res.json({ success: true });
  } catch (err) {
    console.error("💥 DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
