const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Clean URL middleware
app.use(async (req, res, next) => {
    // Skip if the request is for a static file
    if (path.extname(req.path)) {
        return next();
    }

    try {
        // Try to find an HTML file matching the path
        const filePath = path.join(__dirname, 'public', req.path, 'index.html');
        await fs.access(filePath);
        res.sendFile(filePath);
    } catch {
        try {
            // If no index.html, try path.html
            const filePath = path.join(__dirname, 'public', `${req.path}.html`);
            await fs.access(filePath);
            res.sendFile(filePath);
        } catch {
            // If neither exists, continue to next middleware
            next();
        }
    }
});

// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});