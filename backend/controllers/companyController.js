const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../db'); // Import your database connection

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Get all companies
router.get('/companies', async (req, res) => {
    try {
        const [companies] = await db.query('SELECT * FROM companies_list');
        res.json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: 'Error fetching companies' });
    }
});

// Fetch all meters
router.get('/meters', async (req, res) => {
    try {
        const [meters] = await db.query('SELECT * FROM meters');
        res.json(meters);
    } catch (error) {
        console.error("Error fetching meters:", error);
        res.status(500).json({ message: 'Error fetching meters' });
    }
});

// Add a new company (with logo upload)
router.post('/addcompanies', upload.single('logo'), async (req, res) => {
    const { comapnies_name } = req.body;
    const logoPath = req.file ? req.file.path : null;

    try {
        await db.query(
            'INSERT INTO companies_list (comapnies_name, logo) VALUES (?, ?)',
            [comapnies_name, logoPath]
        );
        res.status(201).json({ message: 'Company added successfully' });
    } catch (error) {
        console.error("Error adding company:", error);
        res.status(500).json({ message: 'Error adding company' });
    }
});

// Assign meter to a company
router.post('/companies/:companyId/meters', async (req, res) => {
    const { companyId } = req.params;
    const { meterName, meterType } = req.body;

    try {
        await db.query(
            'INSERT INTO companies_meter (id_comp, meter_name, meter_type) VALUES (?, ?, ?)',
            [companyId, meterName, meterType]
        );
        res.status(201).json({ message: 'Meter assigned successfully' });
    } catch (error) {
        console.error("Error assigning meter:", error);
        res.status(500).json({ message: 'Error assigning meter' });
    }
});

module.exports = router;
