import {Container} from 'react-bootstrap';
import React from "react";
import pageRoutes from '@/routing/routes';
import Header from "@/component/header";
import Footer from "@/component/footer";
import {RoutesRenderer} from "@/routing/routes-renderer";
import {Breadcrumbs} from "@/component/partial/breadcrumbs";


export default function Content() {

    const routes = pageRoutes();

    return (
        <React.Fragment>
            <Header/>
            <main role="main" className="flex-shrink-0">
                <Container className="mb-4">
                    <Breadcrumbs routes={routes}/>
                    <section>
                        <RoutesRenderer routes={routes}/>
                    </section>
                </Container>
            </main>
            <Footer/>
        </React.Fragment>
    );
}