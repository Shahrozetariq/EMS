import React, { useState } from "react";
import axios from "axios";
import { Button, Table, FormGroup, Input, Label, Form, Container, Row, Col, Card, CardBody } from "reactstrap";

const CompanyBill = () => {
    const [month, setMonth] = useState("");
    const [meterType, setMeterType] = useState("");
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCompanyBills = async () => {
        if (!month || !meterType) {
            setError("Both Month and Meter Type are required.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8081/api/companies/company-bill", {
                month,
                meterType,
            });
            setBills(response.data);
        } catch (err) {
            console.error("Error fetching bills:", err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <Container fluid>
                <Row>
                    <Col lg="12" xl="12">
                        <Card className="shadow">
                            <CardBody>
                                <h3 className="mb-4">Company Bill Summary</h3>
                                {/* Form to input month and meter type */}
                                <Form inline onSubmit={(e) => { e.preventDefault(); fetchCompanyBills(); }}>
                                    <FormGroup className="mr-3">
                                        <Label for="month" className="mr-2">Month:</Label>
                                        <Input
                                            type="month"
                                            id="month"
                                            value={month}
                                            onChange={(e) => setMonth(e.target.value)}
                                            className="form-control mb-3 w-auto"
                                        />
                                    </FormGroup>
                                    <FormGroup className="mr-3">
                                        <Label for="meterType" className="mr-2">Meter Type:</Label>
                                        <Input
                                            type="number"
                                            id="meterType"
                                            placeholder="Enter Meter Type"
                                            value={meterType}
                                            onChange={(e) => setMeterType(e.target.value)}
                                            className="form-control mb-3 w-auto"
                                        />
                                    </FormGroup>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        className="btn btn-primary mb-3"
                                    >
                                        Fetch Bills
                                    </Button>
                                </Form>

                                {error && <div className="text-danger mt-3">{error}</div>}
                                {loading && <div className="mt-3">Loading...</div>}

                                {!loading && bills.length > 0 && (
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Company</th>
                                                <th scope="col">Meter Name</th>
                                                <th scope="col">Power Consumed (kWh)</th>
                                                <th scope="col">Total Bill ($)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bills.map((bill, index) => (
                                                <tr key={index}>
                                                    <td>{bill.companyName}</td>
                                                    <td>{bill.meterName}</td>
                                                    <td>{bill.totalPowerConsumed.toFixed(2)}</td>
                                                    <td>{bill.totalBill.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}

                                {!loading && bills.length === 0 && error === "" && (
                                    <div className="mt-3 text-muted">No data to display.</div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CompanyBill;
