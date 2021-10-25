import { Container } from 'react-bootstrap';

import PageRoutes from '../PageRoutes';

export default function Content(props) {
    return (
        <main className="flex-shrink-0">
            <Container>
                <PageRoutes />
            </Container>
        </main>
    );
}