import {Container} from 'react-bootstrap';

import PageRoutes from 'component/page-routes';

export default function Content() {
    return (
        <main className="flex-shrink-0">
            <Container>
                <PageRoutes/>
            </Container>
        </main>
    );
}