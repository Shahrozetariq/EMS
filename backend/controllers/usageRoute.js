const express = require('express');
const router = express.Router();
const { getMonthlyUsageByCompany } = require('./monthlyUsage');

// Route to get monthly usage by company ID
router.get('/companies/:companyId/monthly-usage', getMonthlyUsageByCompany);

module.exports = router;