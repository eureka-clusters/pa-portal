import {Suspense} from "react";
import {Container} from "react-bootstrap";

import Header from "@/component/header";
import Footer from "@/component/footer";
import {QueryState} from "@/component/partial/query-state";
import {RoutesRenderer} from "@/routing/routes-renderer";
import {Breadcrumbs} from "@/component/partial/breadcrumbs";
import {useAppRoutes} from "@/routing/routes";

export default function Content() {
    const routes = useAppRoutes();

    return (
        <>
            <Header routes={routes}/>
            <main role="main" className="flex-grow-1">
                <Container className="pb-4">
                    <Breadcrumbs routes={routes}/>
                    <section>
                        <Suspense fallback={<QueryState isLoading isError={false} loadingMessage="Loading page..."/>}>
                            <RoutesRenderer routes={routes}/>
                        </Suspense>
                    </section>
                </Container>
            </main>
            <Footer/>
        </>
    );
}
