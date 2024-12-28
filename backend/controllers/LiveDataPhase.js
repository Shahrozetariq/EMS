const db = require('../db'); // Import the database connection pool

const getliveDatabyMeter = async (req, res) => {
    console.log("Controller triggered");
    const { companyId, meterType } = req.params;

    // Validate input parameters
    if (!companyId || !meterType) {
        console.error("Missing parameters:", req.params);
        return res.status(400).json({ error: 'Missing required parameters: companyId and meterType' });
    }

    try {
        console.log("Parameters received:", companyId, meterType);

        // Fetch relevant meters for the company and meter type
        const [meters] = await db.query(
            `
            SELECT meter_numeric_id 
            FROM companies_meter 
            WHERE id_comp = ? AND meter_type = ? 
            `,
            [companyId, meterType]
        );

        if (meters.length === 0) {
            console.log("No meters found for the specified company and meter type");
            return res.json({ data: [] });
        }

        const meterNumericIds = meters.map(m => m.meter_numeric_id);

        // Fetch the last 500 records for the relevant meters
        const [emsData] = await db.query(
            `
            SELECT _NUMERICID, _NAME, _VALUE, _TIMESTAMP
            FROM emsdataavn
            WHERE _NUMERICID IN (?) 
            ORDER BY _TIMESTAMP DESC
            LIMIT 50
            `,
            [meterNumericIds]
        );

        console.log("EMS data fetched:", emsData);

        // Process data to combine Phase A, B, C values
        const combinedData = meterNumericIds.map(id => {
            const meterData = emsData.filter(record => record._NUMERICID === id);

            const phaseA = meterData.find(record => record._NAME.includes('Ph A'))?._VALUE || 0;
            const phaseB = meterData.find(record => record._NAME.includes('Ph B'))?._VALUE || 0;
            const phaseC = meterData.find(record => record._NAME.includes('Ph C'))?._VALUE || 0;

            return {
                meter_numeric_id: id,
                phaseA: Math.max(0, parseFloat(phaseA)),
                phaseB: Math.max(0, parseFloat(phaseB)),
                phaseC: Math.max(0, parseFloat(phaseC)),
                timestamp: meterData.length ? meterData[0]._TIMESTAMP : null,
            };
        });

        res.json({ data: combinedData });
    } catch (error) {
        console.error("Error in getliveDatabyMeter:", error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

module.exports = {
    getliveDatabyMeter,
};
