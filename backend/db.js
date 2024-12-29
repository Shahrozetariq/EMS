// db.js
const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: 13013,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,      // Maximum number of connections in the pool
    queueLimit: 0             // Unlimited queue for waiting connections
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connection successful!");
        connection.release(); // Release the connection back to the pool
    }
});
// Export the pool for querying
module.exports = pool.promise();  // Using promise-based queries