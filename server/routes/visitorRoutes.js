const express = require("express");
const router = express.Router();
const Visitor = require("../models/visitor");
const User = require("../models/users");

// Get visitors
// Residents see their own; admins see all
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId || req.headers["x-user-id"] || req.body.userId;
    const user = await User.findById(userId);

    let visitors;
    if (user && user.role === "admin") {
      visitors = await Visitor.find().sort({ datetime: -1 }).populate("createdBy", "name");
    } else if (user) {
      visitors = await Visitor.find({ createdBy: userId }).sort({ datetime: -1 }).populate("createdBy", "name");
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create visitor
router.post("/", async (req, res) => {
  const { name, phone, purpose, datetime, flat, block, idProofType, userId } = req.body;

  try {
    const visitor = await Visitor.create({
      name,
      phone,
      purpose,
      datetime,
      flat,
      block,
      idProofType,
      createdBy: userId,
    });

    res.json(visitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit visitor (resident can edit their own before check-in; admin can edit any)
router.put("/:id", async (req, res) => {
  const { name, phone, purpose, datetime, flat, block, idProofType, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(403).json({ error: "Access denied" });

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ error: "Not found" });

    if (String(visitor.createdBy) !== String(userId) && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (visitor.status !== "pending" && user.role !== "admin") {
      return res.status(400).json({ error: "Cannot edit after check-in" });
    }

    visitor.name = name ?? visitor.name;
    visitor.phone = phone ?? visitor.phone;
    visitor.purpose = purpose ?? visitor.purpose;
    visitor.datetime = datetime ?? visitor.datetime;
    visitor.flat = flat ?? visitor.flat;
    visitor.block = block ?? visitor.block;
    visitor.idProofType = idProofType ?? visitor.idProofType;

    await visitor.save();
    const updated = await Visitor.findById(req.params.id).populate("createdBy", "name");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete visitor (resident can delete their own before check-in; admin can delete any)
router.delete("/:id", async (req, res) => {
  const userId = req.body.userId || req.query.userId || req.headers["x-user-id"];

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(403).json({ error: "Access denied" });

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ error: "Not found" });

    if (String(visitor.createdBy) !== String(userId) && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (visitor.status !== "pending" && user.role !== "admin") {
      return res.status(400).json({ error: "Cannot delete after check-in" });
    }

    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update status (admin or security)
router.patch("/:id/status", async (req, res) => {
  const { status, userId } = req.body;

  if (!["pending", "checked-in", "checked-out"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const user = await User.findById(userId);
    if (!user || (user.role !== "admin" && user.role !== "security")) {
      return res.status(403).json({ error: "Access denied" });
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ error: "Not found" });

    visitor.status = status;
    await visitor.save();

    const updated = await Visitor.findById(req.params.id).populate("createdBy", "name");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
