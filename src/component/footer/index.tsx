import {NavLink} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer mt-auto py-3 border-top bg-body-tertiary">
            <div className="container">
                <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                    <NavLink to="/" className="me-2 text-body-secondary text-decoration-none lh-1">
                        <img alt="Eureka Logo" className="pe-2" src="/assets/img/logo.png"/>
                    </NavLink>
                    <span className="text-body-secondary">&copy; 2026 ITEA Office & Celtic-Next</span>
                </div>
            </div>
        </footer>
    );
}
