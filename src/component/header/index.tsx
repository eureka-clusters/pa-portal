import React from 'react';
import {NavLink} from "react-router-dom";
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { useAuth} from "context/user-context";
import Search from "./search-form/search";

import './header.scss';

export default function Header() {
    // Get auth state and re-render anytime it changes
    let auth = useAuth();

    return (
        <>
            <Navbar variant="light" bg="light" className={'py-2 border-bottom'}>
                <Container className={'d-flex flex-wrap'}>
                    <Navbar.Toggle aria-controls="navbar-main"/>
                    <Navbar.Collapse id="navbar-main">
                        <Nav className='d-flex w-100'>
                            <Nav.Link as={NavLink} to='/'>Home</Nav.Link>

                            <NavDropdown
                                id="nav-dropdown-statistics"
                                title="Statistics"
                            >
                                <NavDropdown.Item as={NavLink} to='/statistics/projects'>Projects</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/statistics/partners'>Partners</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link as={NavLink} to='/projects'>Projects</Nav.Link>
                            <Nav.Link as={NavLink} to='/organisations'>Organisations</Nav.Link>

                            {/* test links will be removed */}
                            {/*<NavDropdown*/}
                            {/*    id="nav-dropdown-test"*/}
                            {/*    title="Test links"*/}
                            {/*    className={'ms-auto'}*/}
                            {/*    align="end"  // align menu to the right */}
                            {/*>*/}
                            {/*    <NavDropdown.Item as={NavLink} to='/public'>Public Page</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Divider/>*/}
                            {/*    <NavDropdown.Item as={NavLink} to='/protected'>Protected Page</NavDropdown.Item>*/}
                            {/*</NavDropdown>*/}

                            {auth.hasUser() ? (
                                <React.Fragment>
                                    <NavDropdown
                                        id="nav-dropdown-account"
                                        // title={`Account (${auth.UserInfo.email})`}  // we could also use auth.getUser() 
                                        title={`Account (${auth.user})`}
                                        className = {'ms-auto'}
                                        align="end"  // align menu to the right 
                                        
                                    >
                                        <NavDropdown.Item as={NavLink} to='/account'>Account</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to='/logout'>Logout</NavDropdown.Item>
                                        {/* <Button onClick={() => auth.logout()}>Logout via button</Button> */}
                                    </NavDropdown>
                                </React.Fragment>
                            ) : (
                                <Nav.Link as={NavLink} to='/login' className={'ms-auto'}>Login</Nav.Link>
                            )}
                          
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <header className="py-3 mb-4 border-bottom">
                <div className="container d-flex flex-wrap justify-content-center">
                    <a href="/"
                       className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none">
                        <img alt={"Eureka Logo"} className={'pe-2'} src={process.env.PUBLIC_URL + '/assets/img/logo.png'} />
                        <span className="fs-4">PA Report Portal</span>
                    </a>
                  
                    <Search/>

                </div>
            </header>
        </>
    );
}