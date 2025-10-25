
// ===== TESLA REAL-TIME TRACKER with MAP =====
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Shipment data with coordinates
let shipments = {
  "TESLA-USA-2410-784632": {
    status: "In Transit",
    location: "Los Angeles, CA",
    lat: 34.0522,
    lng: -118.2437,
    lastUpdated: new Date().toLocaleString()
  }
};

// Serve main page
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Tesla Tracker</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 40px;
        background: #f7f7f7;
      }
      input {
        padding: 10px;
        font-size: 1em;
        width: 250px;
        border-radius: 6px;
        border: 1px solid #ccc;
        margin-right: 10px;
      }
      button {
        padding: 10px 15px;
        background: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 8px;
      }
      #result {
        margin-top: 20px;
        font-size: 1.1em;
      }
      #map {
        height: 400px;
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        border-radius: 10px;
        border: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <h2>🚚 Tesla Real-Time Tracker</h2>
    <input id="trackId" placeholder="Enter Tracking ID" />
    <button onclick="track()">Track</button>
    <div id="result"></div>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      async function track() {
        const id = document.getElementById("trackId").value.trim();
        const result = document.getElementById("result");
        const mapContainer = document.getElementById("map");
        result.innerHTML = "Loading...";
        mapContainer.innerHTML = "";

        try {
          const res = await fetch("/track/" + id);
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          result.innerHTML = "<p><b>Status:</b> " + data.status + "</p>" +
                             "<p><b>Location:</b> " + data.location + "</p>" +
                             "<p><b>Last Updated:</b> " + data.lastUpdated + "</p>";

          if (data.lat && data.lng) {
            const map = L.map("map").setView([data.lat, data.lng], 10);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "&copy; OpenStreetMap contributors"
            }).addTo(map);
            L.marker([data.lat, data.lng])
              .addTo(map)
              .bindPopup("<b>" + data.location + "</b>")
              .openPopup();
          } else {
            mapContainer.innerHTML = "<p style='color:gray;'>No map data available</p>";
          }
        } catch (err) {
          result.innerHTML = "<p style='color:red;'>" + err.message + "</p>";
        }
      }
    </script>
  </body>
  </html>
  `);
});

// Tracking API
app.get("/track/:id", (req, res) => {
  const id = req.params.id;
  const shipment = shipments[id];
  if (!shipment) return res.status(404).json({ error: "Tracking ID not found" });
  res.json(shipment);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Tesla Tracker running on port " + PORT));
