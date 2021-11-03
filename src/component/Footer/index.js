import './Footer.scss';

export default function Footer(props) {
    // Get auth state and re-render anytime it changes
    //const auth = useAuth();

    return (
        <footer className="footer mt-auto py-3 bg-light">
            <div className="container">
                <span className="text-muted">Copyright ITEA & Celtic-Next</span>
            </div>
        </footer>
    );
}