// Changing the __dirname to the current directory
__dirname = "https://github.com/fstevens30/OmniFocus.git";

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/home/home.html'));
});

router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/login/login.html'));
});

router.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/dashboard/dashboard.html'));
});

router.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/profile/profile.html'));
});

// Add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');