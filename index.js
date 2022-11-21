const http = require('http'); // Import the http module
const fs = require('fs'); // Import the fs module

const hostname = '0.0.0.0'; // Define the hostname
const port = process.env.PORT || 3000; // process.env.PORT is used by Heroku

const server = http.createServer((req, res) => { // Create a server
    // Send the requested file if it exists
    var file = fs.readFileSync(__dirname + req.url);

    if (file) {
        res.statusCode = 200;
        res.setHeader('Content-Type', file.split('.').pop())
        res.end(file);
    }
    else {
        res.statusCode = 404;
        res.end();
    }

    req.on('error', (err) => {
        console.error(err);
        res.statusCode = 500;
        res.end();
    });

});

server.listen(port, hostname, () => { // Listen on port 3000
    console.log(`Server running at http://${hostname}:${port}/`); // Log the server is running
});
