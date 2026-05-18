import {useEffect} from "react";
import {Navigate} from "react-router-dom";

import {useAuth} from "@/providers/auth-provider";
import {useUser} from "@/providers/user-provider";

export default function Logout() {
    const {logout} = useAuth();
    const {clearUser} = useUser();

    useEffect(() => {
        clearUser();
        logout();
    }, [clearUser, logout]);

    return <Navigate to="/" replace/>;
}
