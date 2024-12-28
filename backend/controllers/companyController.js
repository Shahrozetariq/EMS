const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getMonthlyUsageByCompany, getMonthlyBill, getLastSixMonthsUsage } = require('./monthlyUsage');
const { getCompaniesWithMeters, deleteMeters } = require('./companiesAndMeters');
const { getliveDatabyMeter } = require('./LiveDataPhase');
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

// Get a specific company by ID
router.get('/companies/:companyId', async (req, res) => {
    const { companyId } = req.params;
    try {
        const [company] = await db.query('SELECT * FROM companies_list WHERE id_comp = ?', [companyId]);
        if (company.length > 0) {
            res.json(company[0]);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching company' });
    }
});

// Update an existing company by ID
router.put('/companies/:companyId', async (req, res) => {
    const { companyId } = req.params;
    const { comapnies_name, meter_type } = req.body;
    try {
        await db.query('UPDATE companies_list SET comapnies_name = ?, meter_type = ? WHERE id_comp = ?', [comapnies_name, meter_type, companyId]);
        res.json({ message: 'Company updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating company' });
    }
});

// Delete a company by ID
router.delete('/companies/:companyId', async (req, res) => {
    const { companyId } = req.params;
    try {
        await db.query('DELETE FROM companies_list WHERE id_comp = ?', [companyId]);
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting company' });
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

router.get('/companies/:companyId/meters', async (req, res) => {
    const { companyId } = req.params;

    try {
        // Query to get company details
        const [companyResult] = await db.query(
            'SELECT * FROM companies_list WHERE id_comp = ?',
            [companyId]
        );

        // Check if the company exists
        if (companyResult.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const company = companyResult[0];

        // Query to get associated meters for the company
        const [metersResult] = await db.query(
            'SELECT * FROM companies_meter WHERE id_comp = ?',
            [companyId]
        );

        // Response with company details and its meters
        res.json({
            company,
            meters: metersResult
        });
    } catch (error) {
        console.error("Error fetching company and meters:", error.message);
        res.status(500).json({ message: 'Error fetching company and meters', error: error.message });
    }
});

// Assign meter to a company
// router.post('/companies/:companyId/meters', async (req, res) => {
//     const { companyId } = req.params;
//     const { meterName, meterType } = req.body;

//     try {
//         await db.query(
//             'INSERT INTO companies_meter (id_comp, meter_name, meter_type) VALUES (?, ?, ?)',
//             [companyId, meterName, meterType]
//         );
//         res.status(201).json({ message: 'Meter assigned successfully' });
//     } catch (error) {
//         console.error("Error assigning meter:", error);
//         res.status(500).json({ message: 'Error assigning meter' });
//     }
// });
router.post('/companies/:companyId/meters', async (req, res) => {
    const { companyId } = req.params;
    const { meterName, meterNumericId, meterType, companyName } = req.body;

    try {
        // Ensure all required fields are provided
        if (!meterName || !meterNumericId || !meterType || !companyName) {
            return res.status(400).json({ message: 'All fields are required: meterName, meterNumericId, meterType, companyName' });
        }

        // Insert the meter into the companies_meter table
        await db.query(
            `INSERT INTO companies_meter (id_comp, company_name, meter_name, meter_numeric_id, meter_type)
             VALUES (?, ?, ?, ?, ?)`,
            [companyId, companyName, meterName, meterNumericId, meterType]
        );

        res.status(201).json({ message: 'Meter assigned successfully' });
    } catch (error) {
        console.error("Error assigning meter:", error);
        res.status(500).json({ message: 'Error assigning meter' });
    }
});


router.get('/companies/liveDataByPhase/:companyId/:meterType', getliveDatabyMeter);
// get monthly usag of company
router.get('/companies/:companyId/monthly-usage', getMonthlyUsageByCompany);
router.post('/companies/company-bill', getMonthlyBill);
router.get('/companies-with-meters', getCompaniesWithMeters);
router.delete('/delete-meters/:meterId', deleteMeters);
router.get('/companiesSixMonthly/:companyId', getLastSixMonthsUsage);
// get live data by meter phase


module.exports = router;
