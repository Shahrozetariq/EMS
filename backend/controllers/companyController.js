// Assuming Express and a database connection are set up
const express = require('express');
const router = express.Router();
const { getMonthlyUsageByCompany } = require('./monthlyUsage');
const db = require('../db'); // Import your database connection



// Get all companies
router.get('/companies', async (req, res) => {
    try {
        const [companies] = await db.query('SELECT * FROM companies_list');
        res.json(companies);
    } catch (error) {
        console.error(error);
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

// Create a new company
router.post('/addcompanies', async (req, res) => {
    const { comapnies_name, meter_type } = req.body;
    try {

        console.log(req.body,"this is the Add Company :" [comapnies_name, meter_type])
        await db.query('INSERT INTO companies_list (comapnies_name, meter_type) VALUES (?, ?)', [comapnies_name, meter_type]);
        res.status(201).json({ message: 'Company created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating company' });
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


// Get single company with associated meters
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
// Get all companies with associated meters

router.get('/companiesandmeters', async (req, res) => {
    try {
        const companies = await db.query(`
            SELECT cl.id_comp, cl.comapnies_name, cm.meter_name, cm.meter_numeric_id 
            FROM defaultdb.companies_list cl
            LEFT JOIN companies_meter cm ON cl.id_comp = cm.id_comp
        `);
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching companies and meters' });
    }
});

// Assign meter to a company
router.post('/companies/:companyId/meters', async (req, res) => {
    const { companyId } = req.params;
    const { companyName, meterName, meterNumericId } = req.body;
    try {
        await db.query(`
            INSERT INTO companies_meter (id_comp, company_name, meter_name, meter_numeric_id)
            VALUES (?, ?, ?, ?)
        `, [companyId, companyName, meterName, meterNumericId]);
        res.status(201).json({ 
            message: 'Meter assigned to company successfully' 
        });
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ message: 'Error assigning meter to company' });
    }
});

// update comapnies meters
router.put('/companies/:companyId/meters/:meterId', async (req, res) => {
    const { companyId, meterId } = req.params;
    const { meterName, meterNumericId } = req.body;
    try {
        await db.query(`
            UPDATE companies_meter
            SET meter_name = ?, meter_numeric_id = ?
            WHERE id_comp = ? AND id = ?
        `, [meterName, meterNumericId, companyId, meterId]);
        res.json({ message: 'Meter association updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating meter association' });
    }
});

router.delete('/companies/:companyId/meters/:meterId', async (req, res) => {
    const { companyId, meterId } = req.params;
    try {
        await db.query(`
            DELETE FROM companies_meter
            WHERE id_comp = ? AND id = ?
        `, [companyId, meterId]);
        res.json({ message: 'Meter association deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting meter association' });
    }
});

router.get('/companies/:companyId/monthly-usage', getMonthlyUsageByCompany);


module.exports = router;