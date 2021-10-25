import React from 'react';
import { NavLink } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from "../../context/UserContext";
import Button from 'react-bootstrap/Button'

import './Header.scss';

export default function Header(props) {
    // Get auth state and re-render anytime it changes
    let auth = useAuth();

    return (
        <header className="header">
            <Navbar variant="light" bg="light" expand="lg" fixed="top">
                <Container>
                    <Navbar.Brand href="#home">PA Report Portal</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-dark-example" />
                    <Navbar.Collapse id="navbar-dark-example">
                        <Nav>
                            <Nav.Link as={NavLink} to='/' exact>Home</Nav.Link>

                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title="Statistics"
                            >   
                                <NavDropdown.Item as={NavLink} to='/statistics/projects'>Projects</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/statistics/partners'>Partners</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link as={NavLink} to='/projects' exact>Projects</Nav.Link>
                            <Nav.Link as={NavLink} to='/organisations' exact>Organisations</Nav.Link>

                            {/* test links */}
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title="Test links"
                            >   
                                <NavDropdown.Item as={NavLink} to='/login2'>Login2</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/public'>Public Page</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={NavLink} to='/protected'>Protected Page</NavDropdown.Item>
                            </NavDropdown>

                            {auth.user ? (
                                <React.Fragment>
                                    {/* // do we need an account page? */}
                                    <Nav.Link as={NavLink} to='/account'>Account ({auth.user})</Nav.Link>

                                    {/* // logout directly via button */}
                                    <Button onClick={() => auth.logout()}>Logout directly via button</Button>

                                    {/* // or logout via page? */}
                                    <Nav.Link as={NavLink} to='/logout'>Logout via page</Nav.Link>
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