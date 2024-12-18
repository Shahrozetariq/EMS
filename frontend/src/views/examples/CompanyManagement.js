import React, { Component } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
} from "reactstrap";
import axios from "axios";
import UserHeader from "components/Headers/UserHeader.js";

class CompanyManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: "",
            logo: null,
            companies: [],
            meters: [],
            selectedCompany: "",
            selectedMeter: "",
            meterType: "",
        };
    }

    componentDidMount() {
        this.fetchCompanies();
        this.fetchMeters();
    }

    fetchCompanies = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/companies");
            this.setState({ companies: response.data });
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    fetchMeters = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api//meters"); // Adjust endpoint if needed
            this.setState({ meters: response.data });
        } catch (error) {
            console.error("Error fetching meters:", error);
        }
    };

    handleCompanySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("comapnies_name", this.state.companyName);
        if (this.state.logo) formData.append("logo", this.state.logo);

        try {
            await axios.post("http://localhost:8081/api/addcompanies", formData);
            this.fetchCompanies();
            this.setState({ companyName: "", logo: null });
        } catch (error) {
            console.error("Error adding company:", error);
        }
    };

    handleAssignMeter = async (e) => {
        e.preventDefault();
        const { selectedCompany, selectedMeter, meterType } = this.state;

        try {
            await axios.post(`http://localhost:8081/api/companies/${selectedCompany}/meters`, {
                meterName: selectedMeter,
                meterType: meterType === "VRF" ? 1 : 2,
            });
            alert("Meter assigned successfully!");
        } catch (error) {
            console.error("Error assigning meter:", error);
        }
    };

    render() {
        return (
            <>
                <UserHeader />
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xl="6">
                            <Card className="bg-secondary shadow">
                                <CardHeader className="bg-white border-0">
                                    <h3 className="mb-0">Add Company</h3>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handleCompanySubmit}>
                                        <FormGroup>
                                            <label className="form-control-label">Company Name</label>
                                            <Input
                                                type="text"
                                                placeholder="Enter company name"
                                                value={this.state.companyName}
                                                onChange={(e) =>
                                                    this.setState({ companyName: e.target.value })
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <label className="form-control-label">Logo</label>
                                            <Input
                                                type="file"
                                                onChange={(e) =>
                                                    this.setState({ logo: e.target.files[0] })
                                                }
                                            />
                                        </FormGroup>
                                        <Button color="primary" type="submit">
                                            Add Company
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl="6">
                            <Card className="bg-secondary shadow">
                                <CardHeader className="bg-white border-0">
                                    <h3 className="mb-0">Assign Meter</h3>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handleAssignMeter}>
                                        <FormGroup>
                                            <label className="form-control-label">Select Company</label>
                                            <Input
                                                type="select"
                                                value={this.state.selectedCompany}
                                                onChange={(e) =>
                                                    this.setState({ selectedCompany: e.target.value })
                                                }
                                            >
                                                <option value="">Select a company</option>
                                                {this.state.companies.map((company) => (
                                                    <option key={company.id_comp} value={company.id_comp}>
                                                        {company.comapnies_name}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <label className="form-control-label">Select Meter</label>
                                            <Input
                                                type="select"
                                                value={this.state.selectedMeter}
                                                onChange={(e) =>
                                                    this.setState({ selectedMeter: e.target.value })
                                                }
                                            >
                                                <option value="">Select a meter</option>
                                                {this.state.meters.map((meter) => (
                                                    <option key={meter.id} value={meter.meter_name}>
                                                        {meter.meter_name}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <label className="form-control-label">Meter Type</label>
                                            <Input
                                                type="select"
                                                value={this.state.meterType}
                                                onChange={(e) =>
                                                    this.setState({ meterType: e.target.value })
                                                }
                                            >
                                                <option value="">Select a type</option>
                                                <option value="VRF">VRF</option>
                                                <option value="Non-VRF">Non-VRF</option>
                                            </Input>
                                        </FormGroup>
                                        <Button color="primary" type="submit">
                                            Assign Meter
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default CompanyManagement;
