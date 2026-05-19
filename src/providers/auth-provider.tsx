import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";

import Config from "@/constants/config";

const AUTH_STORAGE_KEY = "authState";
const DEVELOPMENT_CLIENT_ID = "development";

export interface AuthState {
    jwtToken: string | null;
    clientId: string | null;
    authenticated: boolean;
}

export interface AuthContextContent {
    authState: AuthState;
    isAuthenticated: boolean;
    isDevelopmentAuth: boolean;
    isDevelopmentAuthEnabled: boolean;
    token: string | null;
    clientId: string | null;
    loginWithDevelopmentToken: () => string | null;
    saveAuthState: (authState: AuthState) => void;
    logout: () => void;
}

const emptyAuthState: AuthState = {
    jwtToken: null,
    clientId: null,
    authenticated: false,
};

const AuthContext = createContext<AuthContextContent | undefined>(undefined);

function normalizeJwtToken(token: string): string {
    const trimmedToken = token.trim();

    if (trimmedToken.startsWith("Bearer ")) {
        return trimmedToken.slice("Bearer ".length).trim();
    }

    return trimmedToken;
}

function getDevelopmentAuthState(): AuthState | null {
    if (!Config.DEV_AUTH_TOKEN) {
        return null;
    }

    const jwtToken = normalizeJwtToken(Config.DEV_AUTH_TOKEN);

    if (!jwtToken) {
        return null;
    }

    return {
        jwtToken,
        clientId: DEVELOPMENT_CLIENT_ID,
        authenticated: true,
    };
}

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
    const developmentAuthState = getDevelopmentAuthState();

    if (developmentAuthState) {
        return developmentAuthState;
    }

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
    const developmentAuthState = useMemo(getDevelopmentAuthState, []);
    const isDevelopmentAuthEnabled = developmentAuthState !== null;
    const isDevelopmentAuth = isDevelopmentAuthEnabled && authState.clientId === DEVELOPMENT_CLIENT_ID;

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

    const loginWithDevelopmentToken = useCallback(() => {
        if (!developmentAuthState) {
            return null;
        }

        setAuthState(developmentAuthState);
        return developmentAuthState.jwtToken;
    }, [developmentAuthState]);

    const logout = useCallback(() => {
        setAuthState(emptyAuthState);
    }, []);

    const value = useMemo<AuthContextContent>(() => ({
        authState,
        isAuthenticated: authState.authenticated,
        isDevelopmentAuth,
        isDevelopmentAuthEnabled,
        token: authState.jwtToken,
        clientId: authState.clientId,
        loginWithDevelopmentToken,
        saveAuthState,
        logout,
    }), [authState, isDevelopmentAuth, isDevelopmentAuthEnabled, loginWithDevelopmentToken, logout, saveAuthState]);

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
