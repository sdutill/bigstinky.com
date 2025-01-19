const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve webpack-built files from dist
app.use(express.static(path.join(__dirname, "../dist")));

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
