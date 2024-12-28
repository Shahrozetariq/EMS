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

// Controller to get the last six months of VRF and non-VRF usage for a company
const getLastSixMonthsUsage = async (req, res) => {
    const { companyId } = req.params;

    try {
        // Validate if the company exists
        const [companyResult] = await db.query(
            'SELECT * FROM companies_list WHERE id_comp = ?',
            [companyId]
        );

        if (companyResult.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Query to get the last six months' usage grouped by meter type (1 = VRF, 2 = Non-VRF)
        const query = `
            SELECT 
                MONTH(mpc.month_year) AS month,
                YEAR(mpc.month_year) AS year,
                cm.meter_type,
                IFNULL(SUM(mpc.total_power_consumed), 0) AS total_consumption
            FROM monthly_power_consumption AS mpc
            INNER JOIN companies_meter AS cm ON mpc.numeric_id = cm.meter_numeric_id
            WHERE cm.id_comp = ?
            AND mpc.month_year >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY year, month, cm.meter_type
            ORDER BY year DESC, month DESC;
        `;

        const [usageResult] = await db.query(query, [companyId]);

        // Fill missing months with zero consumption for both VRF and non-VRF
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const filledUsage = [];

        for (let i = 0; i < 6; i++) {
            const month = currentMonth - i > 0 ? currentMonth - i : currentMonth - i + 12;
            const year = currentMonth - i > 0 ? currentYear : currentYear - 1;

            const vrfData = usageResult.find(
                (row) => row.month === month && row.year === year && row.meter_type === 1
            );
            const nonVrfData = usageResult.find(
                (row) => row.month === month && row.year === year && row.meter_type === 2
            );

            filledUsage.push({
                month,
                year,
                vrfConsumption: vrfData ? vrfData.total_consumption : 0,
                nonVrfConsumption: nonVrfData ? nonVrfData.total_consumption : 0,
            });
        }

        res.status(200).json(filledUsage);
    } catch (error) {
        console.error('Error fetching last six months usage:', error.message);
        res.status(500).json({ message: 'Error fetching last six months usage', error: error.message });
    }
};


module.exports = {
    getMonthlyUsageByCompany,
    getMonthlyBill,
    getLastSixMonthsUsage
};