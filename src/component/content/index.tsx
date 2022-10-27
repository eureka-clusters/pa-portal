import {Container} from 'react-bootstrap';
import React from "react";
import PageRoutes from 'component/page-routes';
import Header from "component/header";
import Footer from "component/footer";

export default function Content() {
    return (
        <React.Fragment>
            <Header/>
            <main role="main" className="flex-shrink-0">
                <Container className="mb-4">
                    <PageRoutes/>
                </Container>
            </main>
            <Footer/>
        </React.Fragment>
    );
}