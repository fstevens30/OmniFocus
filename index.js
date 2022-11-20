const http = require('http'); // Import the http module
const fs = require('fs'); // Import the fs module

const hostname = '0.0.0.0'; // Define the hostname
const port = process.env.PORT || 3000; // process.env.PORT is used by Heroku

const server = http.createServer((req, res) => { // Create a server
    res.statusCode = 200; // OK
    res.setHeader('Content-Type', 'text/html'); // Set the content type
    // Send the response as the index.html file
    res.end(fs.readFileSync(__dirname + '/src/home/home.html', 'utf8'));
});

server.listen(port, hostname, () => { // Listen on port 3000
    console.log(`Server running at http://${hostname}:${port}/`); // Log the server is running
});