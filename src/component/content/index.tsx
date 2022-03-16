import {Container} from 'react-bootstrap';

import PageRoutes from 'component/page-routes';
import Header from "component/header";
import Footer from "component/footer";

export default function Content() {
    return (
        <>
            <main className="flex-shrink-0">
                <Header/>
                <Container className="mb-4">
                    <PageRoutes/>
                </Container>

            </main>
            <Footer/>
        </>
    );
}