import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";

const AUTH_STORAGE_KEY = "authState";

export interface AuthState {
    jwtToken: string | null;
    clientId: string | null;
    authenticated: boolean;
}

export interface AuthContextContent {
    authState: AuthState;
    isAuthenticated: boolean;
    token: string | null;
    clientId: string | null;
    saveAuthState: (authState: AuthState) => void;
    logout: () => void;
}

const emptyAuthState: AuthState = {
    jwtToken: null,
    clientId: null,
    authenticated: false,
};

const AuthContext = createContext<AuthContextContent | undefined>(undefined);

function normalizeAuthState(authState: Partial<AuthState> | null | undefined): AuthState {
    const jwtToken = authState?.jwtToken ?? null;
    const clientId = authState?.clientId ?? null;
    const authenticated = Boolean(authState?.authenticated && jwtToken && clientId);

    return {
        jwtToken,
        clientId,
        authenticated,
    };
}

function readStoredAuthState(): AuthState {
    if (typeof window === "undefined") {
        return emptyAuthState;
    }

    const rawAuthState = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawAuthState) {
        return emptyAuthState;
    }

    try {
        return normalizeAuthState(JSON.parse(rawAuthState));
    } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return emptyAuthState;
    }
}

const AuthProvider = ({children}: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>(readStoredAuthState);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (authState.authenticated) {
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
            return;
        }

        window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }, [authState]);

    const saveAuthState = useCallback((nextAuthState: AuthState) => {
        setAuthState(normalizeAuthState(nextAuthState));
    }, []);

    const logout = useCallback(() => {
        setAuthState(emptyAuthState);
    }, []);

    const value = useMemo<AuthContextContent>(() => ({
        authState,
        isAuthenticated: authState.authenticated,
        token: authState.jwtToken,
        clientId: authState.clientId,
        saveAuthState,
        logout,
    }), [authState, logout, saveAuthState]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

export {AuthContext, AuthProvider, useAuth, emptyAuthState};
