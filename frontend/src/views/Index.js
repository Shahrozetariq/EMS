/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import {useEffect,  useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar , Pie} from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

import moment from "moment";

import axios from 'axios'

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";
 


import Header from "components/Headers/Header.js";

import MonthlyUsageChart from "./MonthlyUsageChart";


const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:8081/api/companies/1/monthly-usage")
      .then((response) => {
        console.log("this is data 1122: ", response)
        const sortedData = response.data.sort((a, b) => a.month - b.month); // Ensure correct month order
        setUsageData(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const generateTableRows = () => {
    const rows = [];
    for (let i = 0; i < usageData.length; i += 2) {
      const current = usageData[i];
      const next = usageData[i + 1] || {}; // Handle the case where there's no next month

      // Calculate percentage change
      const change = next.total_consumption && current.total_consumption
        ? (((next.total_consumption - current.total_consumption) / current.total_consumption) * 100).toFixed(2)
        : 0;

      rows.push(
        <tr key={i}>
          <td>{monthNames[current.month - 1]}</td>
          <td>{parseFloat(current.total_consumption || 0).toLocaleString()}</td>
          <td>{monthNames[next.month - 1]}</td>
          <td>{parseFloat(next.total_consumption || 0).toLocaleString()}</td>
          <td>
            {change > 0 ? (
              <i className="fas fa-arrow-up text-success mr-3" />
            ) : change < 0 ? (
              <i className="fas fa-arrow-down text-danger mr-3" />
            ) : (
              <i className="fas fa-minus text-warning mr-3" />
            )}
            {Math.abs(change)}%
          </td>
        </tr>
      );
    }
    return rows;
  };

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Power
                    </h6>
                    <h2 className="text-white mb-0">Monthly Usage - {moment().format('YYYY')}</h2>
                  </div>
                  {/* <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div> */}
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  {/* <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  /> */}
                  <MonthlyUsageChart apiData={usageData} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Consumption
                    </h6>
                    <h2 className="mb-0">VRF/ NON - VRF</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Pie
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Usage Report - {moment().format('YYYY')}</h3>
                  </div>
                  <div className="col text-right">
                 
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Usage</th>
                    <th scope="col">Month</th>
                    <th scope="col">Usage</th>
                    <th scope="col">Change</th>
                  </tr>
                </thead>
                {/* <tbody>
                  <tr>
                    <td>January</td>
                    <td>4,569</td>
                    <td>Feburary</td>
                    <td>4,569</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                    </td>
                  </tr>
                  <tr>
                    <td>March</td>
                    <td>3,985</td>
                    <td>April</td>
                    <td>319</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                  <tr>
                  <td>May</td>
                    <td>3,513</td>
                    <td>June</td>
                    <td>294</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      36,49%
                    </td>
                  </tr>
                  <tr>
                    <td>July</td>
                    <td>2,050</td>
                    <td>August</td>
                    <td>147</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                    </td>
                  </tr>
                  <tr>
                    <td>September</td>
                    <td>1,795</td>
                    <td>October</td>
                    <td>190</td>
                    <td>
                      <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                  <tr>
                    <td>November</td>
                    <td>1,795</td>
                    <td>December</td>
                    <td>190</td>
                    <td>
                      <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                </tbody> */}
                <tbody>{generateTableRows()}</tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Distribution Monthly</h3>
                  </div>
                  
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">VRF</th>
                    <th scope="col">Non VRF</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">January</th>
                    <td>1,480</td>
                    <td>2,560</td>
                    <td>
                      <div className="d-flex align-items-center">
                    
                        <div style={{ width: "60%" }}>
                          <Progress
                            width="50%"
                            max="100"
                            value="60"
                            barClassName="bg-gradient-danger"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Feburary</th>
                    <td>5,480</td>
                    <td>4,560</td>
                    <td>
                      <div className="d-flex align-items-center">
                      
                        <div>
                          <Progress
                            max="100"
                            value="70"
                            barClassName="bg-gradient-success"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">March</th>
                    <td>4,807</td>
                    <td>3,678</td>
                    <td>
                      <div className="d-flex align-items-center">
                        
                        <div>
                          <Progress max="100" value="80" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">April</th>
                    <td>3,678</td>
                    <td>1,478</td>
                    <td>
                      <div className="d-flex align-items-center">
                        
                        <div>
                          <Progress
                            max="100"
                            value="75"
                            barClassName="bg-gradient-info"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">May</th>
                    <td>2,645</td>
                    <td>2,050</td>
                    <td>
                      <div className="d-flex align-items-center">
                       
                        <div>
                          <Progress
                            max="100"
                            value="30"
                            barClassName="bg-gradient-warning"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">June</th>
                    <td>1,765</td>
                    <td>1,230</td>
                    <td>
                      <div className="d-flex align-items-center">
                        
                        <div>
                          <Progress
                            max="100"
                            value="50"
                            barClassName="bg-gradient-danger"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
