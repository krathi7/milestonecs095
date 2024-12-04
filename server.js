const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const WebSocket = require("ws");

app.use(cors());
app.use(bodyParser.json());

// In-memory data for habits
let habits = [
  { id: 1, name: "Exercise", description: "Work out for 30 minutes" },
  { id: 2, name: "Read", description: "Read 20 pages" }
];

// GET all habits
app.get("/habits", (req, res) => {
  res.status(200).json(habits);
});

// GET a habit by ID
app.get("/habits/:id", (req, res) => {
  const habitId = parseInt(req.params.id, 10);
  const habit = habits.find((h) => h.id === habitId);

  if (!habit) {
    return res.status(404).json({ message: "Habit not found" });
  }

  res.status(200).json(habit);
});

// POST a new habit
app.post("/habits", (req, res) => {
  const newHabit = req.body;
  newHabit.id = habits.length + 1; // Assigning a unique ID to the new habit
  habits.push(newHabit); // Adding to the "database" (in this case, the array)
  res.status(201).json(newHabit); // Return the new habit as a response
});

// PUT (update) an existing habit by ID
app.put("/habits/:id", (req, res) => {
  const habitId = parseInt(req.params.id, 10);
  const habitIndex = habits.findIndex((h) => h.id === habitId);

  if (habitIndex === -1) {
    return res.status(404).json({ message: "Habit not found" });
  }

  habits[habitIndex] = { ...habits[habitIndex], ...req.body };
  res.status(200).json(habits[habitIndex]);
});

// DELETE a habit by ID
app.delete("/habits/:id", (req, res) => {
  const habitId = parseInt(req.params.id, 10);
  const habitIndex = habits.findIndex((h) => h.id === habitId);

  if (habitIndex === -1) {
    return res.status(404).json({ message: "Habit not found" });
  }

  habits.splice(habitIndex, 1); // Removing the habit from the array
  res.status(204).end(); // Return 204 (No Content) after deletion
});

// Create HTTP server and integrate WebSocket with Express server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  
  // Listening for messages from the client
  ws.on("message", (message) => {
    console.log("received: %s", message);
  });

  // Send a greeting message to the client
  ws.send("Hello from WebSocket server!");
});

// Start the server on port 5000
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
