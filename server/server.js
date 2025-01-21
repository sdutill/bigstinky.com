const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;

// Adding JSON parsing middleware
app.use(express.json());

// Serve webpack-built files from dist
app.use(express.static(path.join(__dirname, "../dist")));

// Database connection
const db = new sqlite3.Database("./db/database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database", err);
  }
});

// Authenticating endpoints
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (match) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    }
  );
});

// Clean URL middleware for handling all routes
app.get("*", (req, res, next) => {
  // Skip if requesting a file with extension (like .css, .js, etc)
  if (path.extname(req.path)) {
    return next();
  }

  // Send the main index.html for all routes
  // This allows client-side routing to work
  res.sendFile(path.join(__dirname, "../dist/index.html"), (err) => {
    if (err) {
      next(err);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
