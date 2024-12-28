const db = require('../db'); // MySQL database connection


const getCompaniesWithMeters = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT 
                c.id_comp AS companyId,
                c.comapnies_name AS companyName,
                 m.meter_numeric_id AS meterId,
                m.meter_name AS meterName,
                m.meter_type AS meterType
            FROM companies_list c
            LEFT JOIN companies_meter m ON c.id_comp = m.id_comp
        `);

        const groupedResults = results.reduce((acc, row) => {
            const company = acc.find((item) => item.companyId === row.companyId);
            if (company) {
                company.meters.push({
                    meterId: row.meterId,
                    meterName: row.meterName,
                    meterType: row.meterType,
                });
            } else {
                acc.push({
                    companyId: row.companyId,
                    companyName: row.companyName,
                    meters: row.meterId
                        ? [
                            {
                                meterId: row.meterId,
                                meterName: row.meterName,
                                meterType: row.meterType,
                            },
                        ]
                        : [],
                });
            }
            return acc;
        }, []);

        res.json(groupedResults);
    } catch (error) {
        console.error("Error fetching companies with meters:", error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};

const deleteMeters = async (req, res) => {

    const { meterId } = req.params;
    try {
        await db.query('DELETE FROM companies_meter WHERE meter_numeric_id = ?', [meterId]);
        res.json({ message: 'Meter deleted successfully' });
    } catch (error) {
        console.error("Error deleting meter:", error);
        res.status(500).json({ message: 'Error deleting meter' });
    }

}

module.exports = {
    getCompaniesWithMeters,
    deleteMeters
};