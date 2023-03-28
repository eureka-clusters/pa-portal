import {Container} from 'react-bootstrap';
import React from "react";
import Footer from "@/component/footer";


export default function Maintenance() {

    return (
        <React.Fragment>
            <header className="py-3 mb-4 border-bottom">
                <div className="container d-flex flex-wrap justify-content-center">
                    <a href="/"
                       className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none">
                        <img alt={"Eureka Logo"} className={'pe-2'}
                             src={'/assets/img/logo.png'}/>
                        <span className="fs-4">Eureka Clusters PA Portal</span>
                    </a>
                </div>
            </header>
            <main role="main" className="flex-shrink-0">
                <Container className="mb-4">
                    <section>
                        <h1 className={'display-1'}>The PA portal is currently under maintenance.</h1>
                        <p>Please check back later, we apologise for the inconvenience. For questions please reach out
                            to us via <a href={"mailto:feedback@eurekaclusters.eu"}>feedback@eurekaclusters.eu</a>.</p>
                    </section>
                </Container>
            </main>
            <Footer/>
        </React.Fragment>
    );
}