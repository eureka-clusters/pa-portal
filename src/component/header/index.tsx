import {NavLink} from "react-router-dom";
import {Container, Form, Nav, Navbar, NavDropdown} from "react-bootstrap";

import Search from "@/component/header/search-form/search";
import './header.scss';
import {Navigation} from "@/component/partial/navigation";
import {useAuth} from "@/providers/auth-provider";
import {useTheme} from "@/providers/theme-provider";
import {useUser} from "@/providers/user-provider";
import {RoutePathDefinition} from "@/routing/route-part-definition";

export default function Header({routes}: { routes: RoutePathDefinition[] }) {
    const {isAuthenticated} = useAuth();
    const {theme, toggleTheme} = useTheme();
    const {user} = useUser();

    return (
        <>
            <Navbar data-bs-theme={theme} className="py-2 border-bottom bg-body-tertiary">
                <Container className="d-flex flex-wrap">
                    <Navbar.Toggle aria-controls="navbar-main"/>
                    <Navbar.Collapse id="navbar-main">
                        <Nav className="d-flex w-100">
                            <Navigation routes={routes}/>

                            <div className="ms-lg-auto mt-3 mt-lg-0 d-flex flex-column flex-lg-row align-items-lg-center gap-2">
                                <Form.Check
                                    type="switch"
                                    id="dark-mode-switch"
                                    label="Dark mode"
                                    checked={theme === "dark"}
                                    onChange={toggleTheme}
                                    className="theme-switch mb-0 px-2"
                                    aria-label="Toggle dark mode"
                                />

                                {isAuthenticated ? (
                                    <NavDropdown
                                        id="nav-dropdown-account"
                                        title={user?.fullName ?? "Account"}
                                        align="end"
                                    >
                                        <NavDropdown.Item as={NavLink} to="/account">Account</NavDropdown.Item>
                                        <NavDropdown.Divider/>
                                        <NavDropdown.Item as={NavLink} to="/logout">Logout</NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                                )}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <header className="py-3 mb-4 border-bottom bg-body">
                <div className="container d-flex align-items-center justify-content-between">
                    <NavLink
                        to="/"
                        className="d-flex align-items-center text-body-emphasis text-decoration-none gap-2"
                    >
                        <img alt="Eureka Logo" src="/assets/img/logo.png"/>
                        <span className="fs-4">Eureka Clusters PA Portal</span>
                    </NavLink>

                    <Search/>
                </div>
            </header>
        </>
    );
}
