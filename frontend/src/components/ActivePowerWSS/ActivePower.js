import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';

const ActivePower = ({ companyId }) => {
    const [emsData, setEmsData] = useState([]);
    const [ws, setWs] = useState(null);

    // Function to fetch initial EMS data
    const fetchEmsData = async () => {
        try {
            const response = await fetch(process.env.API_ADDRESS + 'companies/${companyId}`);
            const data = await response.json();
            setEmsData(data);
        } catch (error) {
            console.error('Error fetching EMS data:', error);
        }
    };

    useEffect(() => {
        // Create WebSocket connection
        const socket = new WebSocket('ws://localhost:8081');

        // Listen for messages from the WebSocket server
        socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if (message && message.message === 'New EMS data update!') {
                fetchEmsData();  // Fetch the latest EMS data
            }
        });

        // Save the WebSocket instance in state
        setWs(socket);

        // Fetch initial EMS data on mount
        fetchEmsData();

        // Cleanup WebSocket connection on component unmount
        return () => {
            socket.close();
        };
    }, [companyId]);  // Refetch EMS data if companyId changes

    return (
        <Card>
            <CardHeader>
                <h4>EMS Data for Company ID: {companyId}</h4>
            </CardHeader>
            <CardBody>
                {emsData.length > 0 ? (
                    <Row>
                        {emsData.map((data, index) => (
                            <Col md="4" key={index}>
                                <h5>{data._NAME}</h5>
                                <p>Energy: {data._VALUE} KWH</p>
                                <small>{new Date(data._TIMESTAMP).toLocaleString()}</small>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p>No EMS data available for this company.</p>
                )}
            </CardBody>
        </Card>
    );
};

export default ActivePower;
