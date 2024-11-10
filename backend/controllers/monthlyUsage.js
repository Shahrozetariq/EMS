const db = require('../db'); // MySQL database connection

// Controller to get monthly usage of a company by company ID
const getMonthlyUsageByCompany = async (req, res) => {
    const { companyId } = req.params;

    try {
        // Check if the company exists
        const [companyResult] = await db.query(
            'SELECT * FROM companies_list WHERE id_comp = ?',
            [companyId]
        );

        if (companyResult.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Get the monthly usage for the past 12 months, aggregating all meters of the company
        const query = `
            SELECT 
                MONTH(month_year) AS month,
                YEAR(month_year) AS year,
                IFNULL(SUM(total_power_consumed), 0) AS total_consumption
            FROM monthly_power_consumption AS mpc
            INNER JOIN companies_meter AS cm ON mpc.numeric_id = cm.meter_numeric_id
            WHERE cm.id_comp = ?
            GROUP BY year, month
            ORDER BY year DESC, month DESC
            LIMIT 12;
        `;

        const [usageResult] = await db.query(query, [companyId]);

        // Fill in any missing months with 0 consumption if needed
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        let filledUsage = [];
        for (let i = 0; i < 12; i++) {
            const month = currentMonth - i > 0 ? currentMonth - i : currentMonth - i + 12;
            const year = currentMonth - i > 0 ? currentYear : currentYear - 1;

            const monthData = usageResult.find((row) => row.month === month && row.year === year);

            filledUsage.push({
                month,
                year,
                total_consumption: monthData ? monthData.total_consumption : 0
            });
        }

        res.json(filledUsage);
    } catch (error) {
        console.error("Error fetching monthly usage:", error.message);
        res.status(500).json({ message: 'Error fetching monthly usage', error: error.message });
    }
};

module.exports = {
    getMonthlyUsageByCompany
};