// ===== Import required packages =====
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// ===== Initialize app =====
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ===== Serve frontend files =====
app.use(express.static("public")); // this line must come BEFORE your routes

// ===== Connect to MongoDB =====
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ===== Define schema and model =====
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  origin: String
});

const Person = mongoose.model("Person", personSchema);

// ===== API routes =====
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

// ===== Catch-all route (serve index.html) =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== Start the server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
