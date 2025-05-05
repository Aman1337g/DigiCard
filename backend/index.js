import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from "cors";
import axios from 'axios';
import twilio from "twilio";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL client setup
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create tables if not already created
async function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      password TEXT NOT NULL,
      image TEXT,
      phone VARCHAR(15),
      role VARCHAR(50) DEFAULT 'Student',
      status VARCHAR(20) DEFAULT 'in',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createRequestsTable = `
    CREATE TABLE IF NOT EXISTS requests (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      type VARCHAR(20) NOT NULL,
      image TEXT,
      purpose TEXT NOT NULL,
      role VARCHAR(20) DEFAULT 'Student',
      status VARCHAR(20) DEFAULT 'Pending',
      requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.query(createUsersTable);
    await client.query(createRequestsTable);
    console.log("Tables created or already exist.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}

// Function to approve or reject a request
app.patch("/api/requests/:username/:action", async (req, res) => {
  const { username, action } = req.params;
  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  try {
    const requestRes = await pool.query(
      `SELECT * FROM requests WHERE username = $1 AND status = 'Pending' ORDER BY requested_at DESC LIMIT 1`,
      [username]
    );

    if (requestRes.rows.length === 0) {
      return res.status(404).json({ error: "No pending request found" });
    }

    const request = requestRes.rows[0];

    await pool.query(`UPDATE requests SET status = $1 WHERE id = $2`, [
      action.charAt(0).toUpperCase() + action.slice(1),
      request.id,
    ]);

    if (action === "approve") {
      const userRes = await pool.query(
        `SELECT status FROM users WHERE username = $1`,
        [username]
      );

      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentStatus = userRes.rows[0].status.toLowerCase();
      const newStatus = currentStatus === "in" ? "out" : "in";

      await pool.query(`UPDATE users SET status = $1 WHERE username = $2`, [
        newStatus,
        username,
      ]);
    }

    res.status(200).json({ message: `Request ${action}d successfully` });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get pending requests
app.get("/api/requests/pending", async (req, res) => {
  try {
    const result = await client.query(
      `SELECT * FROM requests WHERE status = 'Pending' ORDER BY requested_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to create a user
app.post("/api/users", async (req, res) => {
  const { username, password, role, status, name, phone, image } = req.body;
  try {
    const result = await client.query(
      `INSERT INTO users (username, password, role, status, name, phone, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [username, password, role, status, name, phone, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Route to check if a user has any pending requests
app.get("/api/requests/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const result = await client.query(
      `SELECT * FROM requests WHERE username = $1 AND status = 'Pending'`,
      [username]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).send("Server error");
  }
});

// Route to submit a new request
app.post("/api/requests", async (req, res) => {
  const { username, role, requestType, purpose, image } = req.body;
  try {
    const existing = await client.query(
      `SELECT * FROM requests WHERE username = $1 AND status = 'Pending'`,
      [username]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Request already pending" });
    }

    await client.query(
      `INSERT INTO requests (username, role, type, purpose, image, status, requested_at) 
       VALUES ($1, $2, $3, $4, $5, 'Pending', NOW())`,
      [username, role, requestType, purpose, image]
    );
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (err) {
    console.error("Error inserting request:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM users`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// Route to get user by username
app.get("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/alert", async (req, res) => {
  try {
    // Fetch students who are 'out' and visitors who are 'in'
    const studentsOut = await pool.query(`SELECT phone FROM users WHERE role = 'student' AND status = 'out'`);
    const visitorsIn = await pool.query(`SELECT phone FROM users WHERE role = 'visitor' AND status = 'in'`);

    // Combine phone numbers of students and visitors
    const recipients = [...studentsOut.rows, ...visitorsIn.rows]
      .map(row => row.phone)
      .filter(Boolean);

    if (recipients.length === 0) {
      return res.status(200).json({ message: "No users to notify." });
    }

    // Message to send
    const message = "Greetings from IIIT Bhubaneswar. This is to inform you that your ward is currently outside the campus or, if you are a visitor, you are presently inside the campus. Kindly ensure that students return to campus promptly and visitors exit the premises at the earliest. We appreciate your cooperation in maintaining campus safety and discipline.";

    // Send SMS using Twilio
    const promises = recipients.map(phone => {
      return twilioClient.messages.create({
        body: message,
        to: phone, // Phone number from the DB
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      });
    });

    // Wait for all messages to be sent
    await Promise.all(promises);

    // Respond with success
    res.status(200).json({ message: "Alert sent successfully!" });
  } catch (error) {
    console.error("Error sending alerts:", error);
    res.status(500).json({ error: "Failed to send alerts" });
  }
});

// Start server and create tables
const PORT = process.env.PORT || 3000;
client.connect().then(() => {
  createTables();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
