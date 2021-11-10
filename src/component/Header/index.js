import React from 'react';
import { NavLink } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from "context/UserContext";
// import Button from 'react-bootstrap/Button'

import './Header.scss';

export default function Header(props) {
    // Get auth state and re-render anytime it changes
    let auth = useAuth();

    return (
        <header className="header">
            <Navbar variant="light" bg="light" expand="lg" fixed="top">
                <Container>
                    <Navbar.Brand href="#home">PA Report Portal</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-main" />
                    <Navbar.Collapse id="navbar-main">
                        <Nav>
                            <Nav.Link as={NavLink} to='/' exact>Home</Nav.Link>
                            <NavDropdown
                                id="nav-dropdown-statistics"
                                title="Statistics"
                            >   
                                <NavDropdown.Item as={NavLink} to='/statistics/projects'>Projects</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/statistics/partners'>Partners</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link as={NavLink} to='/projects' exact>Projects</Nav.Link>
                            <Nav.Link as={NavLink} to='/organisations' exact>Organisations</Nav.Link>

                            {/* test links */}
                            <NavDropdown
                                id="nav-dropdown-test"
                                title="Test links"
                            >   
                                <NavDropdown.Item as={NavLink} to='/login2'>Login2</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/public'>Public Page</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={NavLink} to='/protected'>Protected Page</NavDropdown.Item>
                            </NavDropdown>

                            {/* user links */}
                            {auth.user && auth.userInfo? (
                                <React.Fragment>
                                    <NavDropdown
                                        id="nav-dropdown-account"
                                        title={`Account (${auth.userInfo.email})`}
                                    >
                                        <NavDropdown.Item as={NavLink} to='/account'>Account</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to='/logout'>Logout</NavDropdown.Item>
                                        {/* <Button onClick={() => auth.logout()}>Logout via button</Button> */}
                                    </NavDropdown>
                                </React.Fragment>
                            ) : (
                                <Nav.Link as={NavLink} to='/login'>Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}