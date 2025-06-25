const express = require("express");
const router = express.Router();
const Maintenance = require("../models/maintenance");
const User = require("../models/users");

router.get("/", async (req, res) => {
  const requests = await Maintenance.find().populate("user", "name");
  res.json(requests);
});

router.post("/", async (req, res) => {
  const { issue, userId } = req.body;
  const request = await Maintenance.create({ issue, user: userId });
  res.json(request);
});

module.exports = router;
