const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Usermodel = require("./models/users");

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// ✅ Signup route
app.post("/users", (req, res) => {
  Usermodel.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.post("/signin", async (req, res) => {
  const { block, flat, password } = req.body;

  try {
    const user = await Usermodel.findOne({ block, flat });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const noticeRoutes = require("./routes/noticeRoutes");
app.use("/api/notices", noticeRoutes);

const maintenanceRoutes = require("./routes/maintenanceRoutes");
app.use("/api/maintenance", maintenanceRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
