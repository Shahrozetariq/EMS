require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const companyRoutes = require('./controllers/companyController'); 
const cors = require("cors");
// const usageRoutes = require('../controllers/usageRoute');


const app = express();
const PORT = process.env.PORT;

app.use(cors());

// Or configure specific origins (recommended for production)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // If sending cookies or authentication headers
  })
);
// Middleware
app.use(bodyParser.json());

app.use('/api', companyRoutes); 

// app.use('/usage', usageRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
