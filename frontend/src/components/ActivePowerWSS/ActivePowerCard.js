import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Alert } from "reactstrap";
import GaugeChart from "react-gauge-chart";

var maxPower = 300
export const ActivePowerCard = (props) => {
    const [totalPhases, setTotalPhases] = useState({ phaseA: 0, phaseB: 0, phaseC: 0 });


    useEffect(() => {
        // Fetch initial data from API
        fetchEmsData();

        // Establish WebSocket connection
        const ws = new WebSocket("ws://localhost:8081");
        ws.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data);
                if (newData && newData.message === 'New EMS data update!') {
                    fetchEmsData();
                } else {
                    console.error("WebSocket did not return expected format:", newData);
                }
            } catch (e) {
                console.error("Error parsing WebSocket message:", e);
            }
        };

        // Cleanup WebSocket connection
        return () => {
            ws.close();
        };
    }, []);


    const fetchEmsData = async () => {
        try {
            fetch("http://localhost:8081/api/companies/liveDataByPhase/" + props.companyId + "/" + props.meterType)
                .then((response) => response.json())
                .then((data) => {
                    if (data?.data && Array.isArray(data.data)) {
                        console.log("EMS data fetched:", data.data.length);
                        maxPower = (data.data.length) * 300
                        aggregatePhases(data.data);
                    } else {
                        console.error("API did not return expected format:", data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching initial data:", error);
                });
        } catch (error) {
            console.error("Error fetching EMS data:", error);
        }
    }
    // Function to aggregate phase values
    const aggregatePhases = (meters) => {
        const aggregated = meters.reduce(
            (totals, meter) => {
                totals.phaseA += meter.phaseA || 0;
                totals.phaseB += meter.phaseB || 0;
                totals.phaseC += meter.phaseC || 0;
                return totals;
            },
            { phaseA: 0, phaseB: 0, phaseC: 0 }
        );
        setTotalPhases(aggregated);
    };

    props.setTotalPhases(totalPhases.phaseA + totalPhases.phaseB + totalPhases.phaseC);



    return (
        // <Card >

        <>

            {/* Phase - A */}

            <Col >
                <Card className="mb-2" style={{ width: "100%", height: "85%", padding: "5px" }}>
                    <CardBody>
                        <h6 className="card-title text-center">Phase - A</h6>
                        <GaugeChart
                            id="gauge-phase-a"
                            nrOfLevels={30}
                            colors={["#FF5F6D", "#FFC371"]}
                            arcWidth={0.3}
                            percent={Math.min(totalPhases.phaseA / maxPower, 1)}
                            style={{ width: "100%" }}
                            textColor="#000"
                        />
                        <p className="text-center small mt-2">
                            <strong>{totalPhases.phaseA.toFixed(2)}</strong>
                        </p>
                    </CardBody>
                </Card>
            </Col>

            {/* Phase - B */}
            <Col md={2} >
                <Card className="mb-1" style={{ width: "100%", height: "85%", padding: "5px" }} >
                    <CardBody>
                        <h6 className="card-title text-center">Phase - B</h6>
                        <GaugeChart
                            id="gauge-phase-b"
                            nrOfLevels={30}
                            colors={["#FF5F6D", "#FFC371"]}
                            arcWidth={0.3}
                            percent={Math.min(totalPhases.phaseB / maxPower, 1)}
                            style={{ width: "100%" }}
                            textColor="#000"
                        />
                        <p className="text-center small mt-2">
                            <strong>{totalPhases.phaseB.toFixed(2)}</strong>
                        </p>
                    </CardBody>
                </Card>
            </Col>

            {/* Phase - C */}
            <Col >
                <Card className="mb-2" style={{ width: "maxPower%", height: "85%", padding: "5px" }}>
                    <CardBody>
                        <h6 className="card-title text-center">Phase - C</h6>
                        <GaugeChart
                            id="gauge-phase-c"
                            nrOfLevels={30}
                            colors={["#FF5F6D", "#FFC371"]}
                            arcWidth={0.3}
                            percent={Math.min(totalPhases.phaseC / maxPower, 1)}
                            style={{ width: "100%" }}
                            textColor="#000"
                        />
                        <p className="text-center small mt-2">
                            <strong>{totalPhases.phaseC.toFixed(2)}</strong>
                        </p>
                    </CardBody>
                </Card>
            </Col>


        </>
        // </Card>
    );
};

export default ActivePowerCard;