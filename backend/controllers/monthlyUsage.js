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

const getMonthlyBill = async (req, res) => {
    const { month, meterType } = req.body;

    if (!month || !meterType) {
        return res.status(400).json({ message: 'Month and meterType are required' });
    }

    // Hardcoded rate for the given meter type
    const ratePerUnit = 5.50; // Example rate, adjust as needed

    try {
        const query = `
        SELECT
            cl.comapnies_name AS company_name,
            cl.logo,
            cm.meter_name,
            SUM(mpc.total_power_consumed) AS total_power_consumed
        FROM
            defaultdb.companies_list AS cl
        INNER JOIN
            defaultdb.companies_meter AS cm ON cl.id_comp = cm.id_comp
        INNER JOIN
            defaultdb.monthly_power_consumption AS mpc ON cm.meter_numeric_id = mpc.numeric_id
        WHERE
            cm.meter_type = ?
            AND DATE_FORMAT(mpc.month_year, '%Y-%m') = ?
        GROUP BY
            cl.id_comp, cm.meter_name
        
        `;

        const results = await db.query(query, [meterType, month]);
        console.log("bills", results);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No data found for the provided criteria' });
        }

        const response = results[0].map((row) => ({
            companyName: row.company_name,
            logo: row.logo,
            meterName: row.meter_name,
            totalPowerConsumed: parseFloat(row.total_power_consumed), // Ensure numeric conversion
            totalBill: parseFloat(row.total_power_consumed) * ratePerUnit, // Ensure numeric conversion
        }));
        console.log("response:", response)
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching company bill:", error);
        res.status(500).json({ message: 'Error fetching company bill' });
    }
};

module.exports = {
    getMonthlyUsageByCompany,
    getMonthlyBill
};