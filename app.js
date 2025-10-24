// ===== TESLA REAL-TIME TRACKER (single-file version) =====
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// shipment data
let shipments = {
  "TESLA-USA-2410-784632": {
    status: "In Transit",
    location: "Los Angeles, CA",
    lastUpdated: new Date().toLocaleString()
  }
};

// serve tracking page
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Tesla Tracker</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 50px;
        background: #f7f7f7;
      }
      input {
        padding: 10px;
        font-size: 1em;
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
    </style>
  </head>
  <body>
    <h2>🚚 Tesla Real-Time Tracker</h2>
    <input id="trackId" placeholder="Enter Tracking ID" />
    <button onclick="track()">Track</button>
    <div id="result"></div>
    <script>
      async function track() {
        const id = document.getElementById("trackId").value;
        const result = document.getElementById("result");
        result.innerHTML = "Loading...";
        try {
          const res = await fetch("/track/" + id);
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          result.innerHTML = "<p><b>Status:</b> " + data.status + "</p>" +
                             "<p><b>Location:</b> " + data.location + "</p>" +
                             "<p><b>Last Updated:</b> " + data.lastUpdated + "</p>";
        } catch (err) {
          result.innerHTML = "<p style='color:red;'>" + err.message + "</p>";
        }
      }
    </script>
  </body>
  </html>
  `);
});

// tracking API
app.get("/track/:id", (req, res) => {
  const id = req.params.id;
  const shipment = shipments[id];
  if (!shipment) return res.status(404).json({ error: "Tracking ID not found" });
  res.json(shipment);
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Tesla Tracker running on port " + PORT));
