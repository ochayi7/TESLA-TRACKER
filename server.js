const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

// Store latest GPS for Tesla
let vehicleLocations = {};

// Endpoint to update location
app.get('/update-location', (req, res) => {
    const { lat, lng } = req.query;
    const trackingId = "TESLA-USA-2410-784632"; // Fixed Tesla ID

    if (lat && lng) {
        vehicleLocations[trackingId] = [parseFloat(lat), parseFloat(lng)];
        io.emit(`locationUpdate-${trackingId}`, vehicleLocations[trackingId]);
        res.send('Location updated');
    } else {
        res.send('Missing lat/lng');
    }
});

// Serve main page
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Socket connection
io.on('connection', socket => {
    const trackingId = "TESLA-USA-2410-784632";
    if (vehicleLocations[trackingId]) {
        socket.emit(`locationUpdate-${trackingId}`, vehicleLocations[trackingId]);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
