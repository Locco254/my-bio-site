const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static frontend

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema & model
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  origin: String,
});
const Person = mongoose.model("Person", personSchema);

// API routes
app.get("/people", async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/people", async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    await newPerson.save();
    res.json(newPerson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend for any other path
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
