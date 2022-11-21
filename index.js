const http = require('http'); // Import the http module
const fs = require('fs'); // Import the fs module

const hostname = '0.0.0.0'; // Define the hostname
const port = process.env.PORT || 3000; // process.env.PORT is used by Heroku

const server = http.createServer((req, res) => { // Create a server
    // Send the requested file
    res.statusCode = 200;

    // Get the content type (end of the url))
    res.setHeader('Content-Type', 'text/' + req.url.split('.').pop());
    res.end(fs.readFileSync(__dirname + req.url));
});

server.listen(port, hostname, () => { // Listen on port 3000
    console.log(`Server running at http://${hostname}:${port}/`); // Log the server is running
});
