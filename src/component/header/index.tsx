import React from 'react';
import {NavLink} from "react-router-dom";
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {UseAuth} from "context/user-context";
import Button from 'react-bootstrap/Button'

import './header.scss';
import Config from "../../constants/config";

export default function Header() {
    // Get auth state and re-render anytime it changes
    let auth = UseAuth();

    return (
        <>
            <Navbar variant="light" bg="light" className={'py-2 border-bottom'}>
                <Container className={'d-flex flex-wrap'}>
                    <Navbar.Toggle aria-controls="navbar-dark-example"/>
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
                                <NavDropdown.Divider/>
                                <NavDropdown.Item as={NavLink} to='/protected'>Protected Page</NavDropdown.Item>
                            </NavDropdown>

                            {auth.hasUser() ? (
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
            <header className="py-3 mb-4 border-bottom">
                <div className="container d-flex flex-wrap justify-content-center">
                    <a href="/"
                       className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none">
                        <img className={'pe-2'} src={'https://image.itea3.org/vHVUI8HfFtzgYrZnl--zCxbf_HY=/190x150:443x484/fit-in/30x30/smart/https://tool.eureka-clusters-ai.eu/img/i/14-1614258308.png'}/>
                        <span className="fs-4">PA Report Portal</span>
                    </a>
                    <form className="col-12 col-lg-auto mb-3 mb-lg-0">
                        <input type="search" className="form-control" placeholder="Search..." aria-label="Search"/>
                    </form>
                </div>
            </header>
        </>
    );
}