import {Navigate} from "react-router-dom";

export default function ProtectedRoute({isAuthenticated, children}: { isAuthenticated: boolean, children: any }) {
    if (!isAuthenticated) {
        return (
            <Navigate to={{pathname: "/login"}} replace/>
        );
    }

    return children;
}
