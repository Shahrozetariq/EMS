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
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

import axios from 'axios';

import { useEffect, useState } from "react";



const AdminNavbar = (props) => {

  const [companyID, setCompanyID] = useState(1);
  const [compnayList, setCompanyList] = useState([]);
  const [companyName, setCompanyName] = useState("")


   useEffect(() => {
      // Fetch data from the API 
      getCompanyList();

   });

  const getCompanyList = () => {
    axios
      .get(process.env.REACT_APP_API_ADDRESS + "companies")
      .then((response) => {
        // console.log("this is data 1122: ", response)
        // const sortedData = response.data.sort((a, b) => a.month - b.month); // Ensure correct month order
        getCompanyListById(response.data);
        setCompanyList(response.data);
        
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // setLoading(false);
      });

  }

  const getCompanyListById = (data) => {
    const company = data.find((company) => company.id_comp === companyID);

    console.log(data,"Company Name",company, companyID)
    setCompanyName(company ? company.comapnies_name : "Company not found");
  }

  const handleChange = (event) => { 
    
    setCompanyID(parseInt(event.target.value));
    getCompanyList(compnayList);
    // Update the state with selected company id
  };
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form> */}
          <Nav className="align-items-center d-none d-md-flex" navbar>
            {/* //User Profile Dropdown */}
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                    {companyName}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                
                  <label htmlFor="company-select" className="noti-title">Select a Company: </label>
                  <select className="dropdown-menu-arrow" id="company-select" onChange={handleChange} value={companyID}>
                    <option  value="">-- Select a Company --</option>
                    {compnayList.map((company) => (
                      <option className="ni ni-single-02" key={company.id_comp} value={company.id_comp}>
                        {company.comapnies_name}
                      </option>
                    ))}
                  </select>

                  {/* Display selected company ID for testing */}
                  {companyID && <p>Selected Company ID: {companyID}</p>}
                
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
