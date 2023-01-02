import {Container} from 'react-bootstrap';
import React from "react";
import pageRoutes from '@/routing/routes';
import Header from "@/component/header";
import Footer from "@/component/footer";
import {RoutesRenderer} from "@/routing/routes-renderer";
import {Breadcrumbs} from "@/component/partial/breadcrumbs";
import {Navigation} from "@/component/partial/navigation";


export default function Content() {

    const routes = pageRoutes();

    return (
        <React.Fragment>
            <Header/>
            <Container className="mb-4">
                <main role="main" className="flex-shrink-0">
                    <Breadcrumbs routes={routes}/>
                    <section>
                        <RoutesRenderer routes={routes}/>
                    </section>
                </main>
            </Container>
            <Footer/>
        </React.Fragment>
    );
}