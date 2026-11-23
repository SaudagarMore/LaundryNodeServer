const http = require('http');
const fs = require('fs');
const path = require('path');
// Project directory
const rootDir = __dirname;
// Function to serve files asynchronously
async function serveFile(filePath, res, statusCode = 200) {
    try {
        const data = await fs.promises.readFile(filePath);
        // Set the response status code
        res.statusCode = statusCode;
        // Set the content type
        res.setHeader('Content-Type', 'text/html');
        // Send the file content
        res.end(data);
    }
    catch (error) {
        console.log('File error:', error.message);
        res.statusCode = 500;
        res.end('<h1>500 - Internal Server Error</h1>');
    }
}
// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Get the requested URL path
    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = url.pathname;
    console.log(`Request received: ${req.method} ${route}`);
    // Route: Home Page
    if (route === '/' || route === '/home') {
        const filePath = path.join(rootDir, 'pages', 'home.html');
        await serveFile(filePath, res);
    }
    // Route: About Page
    else if (route === '/about') {
        const filePath = path.join(rootDir, 'pages', 'about.html');
        await serveFile(filePath, res);
    }
    // Route: Contact Page
    else if (route === '/contact') {
        const filePath = path.join(rootDir, 'pages', 'contact.html');
        await serveFile(filePath, res);
    }
    // Route: CSS File
    else if (route === '/style.css') {
        try {
            const cssPath = path.join(rootDir, 'public', 'style.css');
            const cssData = await fs.promises.readFile(cssPath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/css');
            res.end(cssData);
        }
        catch (error) {
            console.log('CSS error:', error.message);
            res.statusCode = 500;
            res.end('Unable to load CSS file');
        }
    }
    // Route: Page Not Found
    else {
        const filePath = path.join(rootDir, 'pages', '404.html');
        await serveFile(filePath, res, 404);
    }
});
// Server port
const PORT = 3000;
// Start server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
