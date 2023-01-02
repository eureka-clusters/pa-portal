import React from "react";

export default function Footer() {
    return (
        <footer className="bg-light footer mt-auto py-2">
            <div className="container">
                <div className="col-md-4 d-flex align-items-center">
                    <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                        <img alt={"Eureka Logo"} className={'pe-2'} src={'/assets/img/logo.png'} />
                    </a>
                    <span className="text-muted">&copy; 2022 ITEA Office & Celtic-Next</span>
                </div>
            </div>
        </footer>
    );
}