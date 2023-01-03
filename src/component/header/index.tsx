import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import Search from "@/component/header/search-form/search";
import {AuthContext} from "@/providers/auth-provider";
import {UserContext} from "@/providers/user-provider";

import './header.scss';
import {Navigation} from "@/component/partial/navigation";
import pageRoutes from "@/routing/routes";

export default function Header() {
    // Get auth state and re-render anytime it changes
    let authContext = useContext(AuthContext);
    let userContext = useContext(UserContext);
    let routes = pageRoutes();

    return (
        <>
            <Navbar variant="light" bg="light" className={'py-2 border-bottom'}>
                <Container className={'d-flex flex-wrap'}>
                    <Navbar.Toggle aria-controls="navbar-main"/>
                    <Navbar.Collapse id="navbar-main">
                        <Nav className='d-flex w-100'>

                            <Navigation routes={routes}/>

                            {authContext.isAuthenticated() ? (
                                <React.Fragment>
                                    <NavDropdown
                                        id="nav-dropdown-account"
                                        // title={`Account (${auth.UserInfo.email})`}  // we could also use auth.getUser() 
                                        title={`Account (${userContext.getUser().email})`}
                                        className={'ms-auto'}
                                        align="end"  // align menu to the right 

                                    >
                                        <NavDropdown.Item as={NavLink} to='/account'>Account</NavDropdown.Item>
                                        <NavDropdown.Divider/>
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
                        <img alt={"Eureka Logo"} className={'pe-2'}
                             src={'/assets/img/logo.png'}/>
                        <span className="fs-4">Eureka Clusters PA Portal</span>
                    </a>

                    <Search/>

                </div>
            </header>
        </>
    );
}