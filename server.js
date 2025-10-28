// ===== Import required packages =====
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // <-- Add this line

// ===== Initialize app =====
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // <-- Add this line to serve static files

// ===== Connect to MongoDB Atlas =====
const mongoURI = process.env.MONGODB_URI; // Use Render environment variable
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

// ===== Define schema and model =====
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  origin: String
});

const Person = mongoose.model("Person", personSchema);

// ===== API Routes =====

// Get all people
app.get("/people", async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new person
app.post("/people", async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    await newPerson.save();
    res.json(newPerson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a person
app.put("/people/:id", async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPerson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a person
app.delete("/people/:id", async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Serve index.html for root URL =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // <-- Add this line
});

// ===== Start the server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
