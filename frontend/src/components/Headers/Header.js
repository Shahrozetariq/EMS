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

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Active Power - VRF
                        </CardTitle>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap ">Line 1 </span>
                          <span className="text-warning mr-2 text-nowrap">
                          {" - "} 3859W
                          </span>
                        </p>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap">Line 2 </span>
                          <span className="text-info mr-2 text-nowrap">
                          {" - "} 3859W
                          </span>{" "}
                        </p>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap">Line 3</span>
                          <span className="text-success mr-2 text-nowrap">
                          {" - "} 3859W
                          </span>{" "}
                        </p>

                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 9000
                      </span>{" "}
                      <span className="text-nowrap">Total</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Energy
                        </CardTitle>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap ">Non VRF</span>
                          <span className="text-warning mr-2 text-nowrap">
                          {" - "} 3859
                          </span>
                        </p>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap">VRF </span>
                          <span className="text-info mr-2 text-nowrap">
                          {" - "} 0
                          </span>
                        </p>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap"></span>
                          <span className="text-success mr-2 text-nowrap">
                          {"  "} 
                          </span>
                        </p>

                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-add" /> 9000
                      </span>{" "}
                      <span className="text-nowrap">Combined</span>
                    </p>
                  </CardBody>
                </Card>
              </Col><Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Energy
                        </CardTitle>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap ">Non VRF</span>
                          <span className="text-warning mr-2 text-nowrap">
                          {" - "} 3859W
                          </span>
                        </p>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap">Line 2 </span>
                          <span className="text-info mr-2 text-nowrap">
                          {" - "} 3859W
                          </span>
                        </p>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-nowrap">Line 3</span>
                          <span className="text-success mr-2 text-nowrap">
                          {" - "} 3859W
                          </span>
                        </p>

                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 9000
                      </span>{" "}
                      <span className="text-nowrap">Total</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
