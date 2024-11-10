require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const companyRoutes = require('./controllers/companyController'); 
// const usageRoutes = require('../controllers/usageRoute');


const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());

app.use('/api', companyRoutes); 

// app.use('/usage', usageRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
