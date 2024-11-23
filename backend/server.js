require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const companyRoutes = require('./controllers/companyController'); 
const activePower = require('./controllers/liveEmsDataController')
const cors = require("cors");
const WebSocket = require('ws'); // Import ws for WebSocket support

const app = express();
const PORT = process.env.PORT;

app.use(cors());

// Configure specific origins (recommended for production)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // If sending cookies or authentication headers
  })
);

// Middleware
app.use(bodyParser.json());

// Use company routes (no change)
app.use('/api', companyRoutes);
app.use('/live',activePower)

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Set up WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    // Handle incoming messages
    ws.on('message', (message) => {
        console.log('Received message:', message);
    });

    // Send a periodic update to the client (every 5 seconds as an example)
    const sendUpdate = () => {
        ws.send(JSON.stringify({ message: 'New EMS data update!' }));
    };

    // Set an interval to broadcast updates
    const interval = setInterval(sendUpdate, 5000);

    // Clean up when WebSocket is closed
    ws.on('close', () => {
        clearInterval(interval);
        console.log('WebSocket connection closed');
    });
});

// Upgrade HTTP server to handle WebSocket requests
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
