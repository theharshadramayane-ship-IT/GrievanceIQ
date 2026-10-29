const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' })); // React frontend ko allow karega
app.use(express.json()); // JSON data read karne ke liye

// 1. Home Route (Test ke liye)
app.get('/', (req, res) => {
  res.json({ status: "Backend is running perfectly with Node.js!" });
});

// 2. Complaint Submit API
app.post('/api/submit', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Simple NLP Routing Logic
    let dept = "General";
    const text = (title + " " + description).toLowerCase();
    if (text.includes("water") || text.includes("leak")) dept = "Water Supply";
    else if (text.includes("road") || text.includes("pothole")) dept = "Public Works";
    else if (text.includes("light") || text.includes("electric")) dept = "Electricity Board";

    const newComplaint = await pool.query(
      "INSERT INTO complaints (title, description, department) VALUES ($1, $2, $3) RETURNING *",
      [title, description, dept]
    );

    res.json({ message: "Complaint Submitted!", data: newComplaint.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 3. Saari Complaints nikalne ka API (Dashboard ke liye)
app.get('/api/complaints', async (req, res) => {
  try {
    const allComplaints = await pool.query("SELECT * FROM complaints ORDER BY id DESC");
    res.json(allComplaints.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 4. Complaint Resolve karne ka API
app.post('/api/resolve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateComplaint = await pool.query(
      "UPDATE complaints SET status = 'Resolved', sla_time = 'Completed' WHERE id = $1 RETURNING *",
      [id]
    );
    res.json({ message: "Resolved", data: updateComplaint.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Server Start
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});