import React, { useEffect, useState } from "react";
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    Table,
    Container,
    Row,
    Button,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";

const CompaniesWithMeters = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching companies with meters...");
        fetchCompaniesWithMeters();
    }, []);

    const fetchCompaniesWithMeters = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "companies-with-meters");
            setCompanies(response.data);
        } catch (error) {
            console.error("Error fetching companies with meters:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMeter = async (meterId) => {
        try {
            await axios.delete(`http://localhost:8081/api/meters/${meterId}`);
            alert("Meter deleted successfully!");
            fetchCompaniesWithMeters(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting meter:", error);
            alert("Failed to delete meter.");
        }
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Companies and Meters</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Company</th>
                                        <th scope="col">Meter Name</th>
                                        <th scope="col">Meter Type</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : companies.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                No companies or meters found.
                                            </td>
                                        </tr>
                                    ) : (
                                        companies.map((company) => (
                                            <React.Fragment key={company.companyId}>
                                                {company.meters.length > 0 ? (
                                                    company.meters.map((meter, index) => (
                                                        <tr key={meter.meterId}>
                                                            {index === 0 && (
                                                                <td rowSpan={company.meters.length}>
                                                                    {company.companyName}
                                                                </td>
                                                            )}
                                                            <td>{meter.meterName}</td>
                                                            <td>{meter.meterType}</td>
                                                            <td>
                                                                <Button
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={() => deleteMeter(meter.meterId)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td>{company.companyName}</td>
                                                        <td colSpan="3" className="text-center">
                                                            No meters assigned
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                            <CardFooter className="py-4">
                                <nav aria-label="...">
                                    <Button
                                        color="primary"
                                        onClick={() => fetchCompaniesWithMeters}
                                    >
                                        Refresh List
                                    </Button>
                                </nav>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default CompaniesWithMeters;
