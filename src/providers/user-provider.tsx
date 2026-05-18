import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";

import {getServerUri} from "@/functions/get-server-uri";
import {User} from "@/interface/auth/user";
import {useAuth} from "@/providers/auth-provider";
import {useAxios} from "@/providers/axios-provider";

const USER_STORAGE_KEY = "user";

interface UserContextContent {
    user: User | null;
    loadUser: (token: string) => Promise<User>;
    refreshUser: () => Promise<User>;
    clearUser: () => void;
}

const UserContext = createContext<UserContextContent | undefined>(undefined);

function readStoredUser(): User | null {
    if (typeof window === "undefined") {
        return null;
    }

    const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser) as User;
    } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
}

const UserProvider = ({children}: { children: ReactNode }) => {
    const {authAxios} = useAxios();
    const {isAuthenticated} = useAuth();
    const [user, setUser] = useState<User | null>(readStoredUser);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (user) {
            window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            return;
        }

        window.localStorage.removeItem(USER_STORAGE_KEY);
    }, [user]);

    useEffect(() => {
        if (!isAuthenticated) {
            setUser(null);
        }
    }, [isAuthenticated]);

    const clearUser = useCallback(() => {
        setUser(null);
    }, []);

    const loadUser = useCallback(async (token: string) => {
        const response = await axios.get<User>(`${getServerUri()}/api/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setUser(response.data);
        return response.data;
    }, []);

    const refreshUser = useCallback(async () => {
        const response = await authAxios.get<User>("/me");

        setUser(response.data);
        return response.data;
    }, [authAxios]);

    const value = useMemo<UserContextContent>(() => ({
        user,
        loadUser,
        refreshUser,
        clearUser,
    }), [clearUser, loadUser, refreshUser, user]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}

export {UserContext, UserProvider, useUser};
