const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your database connection

// Get latest energy data for a company based on companyId
router.get('/companies/:companyId/emsdata', async (req, res) => {
    const { companyId } = req.params;
    console.log("live phase data")
    try {
        // Query to fetch the latest energy data for a company
        const [emsData] = await db.query(`
           SELECT eda.* 
            FROM emsdataavn eda
            JOIN companies_meter cm ON eda._NUMERICID = cm.meter_numeric_id
            WHERE cm.id_comp = ?
            ORDER BY eda._TIMESTAMP DESC
            LIMIT 1;
        `, [companyId]);

        // Check if data is available for the company
        if (emsData.length > 0) {
            res.json(emsData);
        } else {
            res.status(404).json({ message: 'No data found for this company' });
        }
    } catch (error) {
        console.error('Error fetching EMS data:', error);
        res.status(500).json({ message: 'Error fetching EMS data' });
    }
});

module.exports = router;