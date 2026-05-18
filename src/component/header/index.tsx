import {NavLink} from "react-router-dom";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";

import Search from "@/component/header/search-form/search";
import './header.scss';
import {Navigation} from "@/component/partial/navigation";
import {useAuth} from "@/providers/auth-provider";
import {useUser} from "@/providers/user-provider";
import {RoutePathDefinition} from "@/routing/route-part-definition";

export default function Header({routes}: { routes: RoutePathDefinition[] }) {
    const {isAuthenticated} = useAuth();
    const {user} = useUser();

    return (
        <>
            <Navbar variant="light" bg="light" className="py-2 border-bottom">
                <Container className="d-flex flex-wrap">
                    <Navbar.Toggle aria-controls="navbar-main"/>
                    <Navbar.Collapse id="navbar-main">
                        <Nav className="d-flex w-100">
                            <Navigation routes={routes}/>

                            {isAuthenticated ? (
                                <NavDropdown
                                    id="nav-dropdown-account"
                                    title={user?.fullName ?? "Account"}
                                    className="ms-auto"
                                    align="end"
                                >
                                        <NavDropdown.Item as={NavLink} to="/account">Account</NavDropdown.Item>
                                        <NavDropdown.Divider/>
                                        <NavDropdown.Item as={NavLink} to="/logout">Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link as={NavLink} to="/login" className="ms-auto">Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <header className="py-3 mb-4 border-bottom">
                <div className="container d-flex flex-wrap justify-content-center">
                    <NavLink
                        to="/"
                        className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none"
                    >
                        <img alt="Eureka Logo" className="pe-2" src="/assets/img/logo.png"/>
                        <span className="fs-4">Eureka Clusters PA Portal</span>
                    </NavLink>

                    <Search/>
                </div>
            </header>
        </>
    );
}
