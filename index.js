const http = require('http'); // Import the http module
const fs = require('fs'); // Import the fs module

const hostname = '0.0.0.0'; // Define the hostname
const port = process.env.PORT || 3000; // process.env.PORT is used by Heroku

const server = http.createServer((req, res) => { // Create a server
    // Send the requested file if it exists
    var url = __dirname + req.url

    if (fs.existsSync(url)) {
        res.statusCode = 200;
        res.end(fs.readFileSync(url))
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
