const express = require('express');
const mysql = require('mysql2');
const app = express();

const meterRoutes = require('./server');

app.use(meterRoutes);

describe('GET /meters/:id', () => {

});
