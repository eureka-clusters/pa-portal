import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";

const THEME_STORAGE_KEY = "portal-theme";
const DEFAULT_THEME = "dark";

export type Theme = "light" | "dark";

interface ThemeContextContent {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextContent | undefined>(undefined);

function isTheme(value: unknown): value is Theme {
    return value === "light" || value === "dark";
}

function applyTheme(theme: Theme) {
    if (typeof document === "undefined") {
        return;
    }

    document.documentElement.setAttribute("data-bs-theme", theme);
    document.documentElement.style.colorScheme = theme;
}

function readStoredTheme(): Theme {
    if (typeof window === "undefined") {
        return DEFAULT_THEME;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (isTheme(storedTheme)) {
        return storedTheme;
    }

    if (storedTheme) {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
    }

    return DEFAULT_THEME;
}

const ThemeProvider = ({children}: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(readStoredTheme);

    useEffect(() => {
        applyTheme(theme);

        if (typeof window !== "undefined") {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
    }, [theme]);

    const setTheme = useCallback((nextTheme: Theme) => {
        setThemeState(nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((currentTheme) => currentTheme === "dark" ? "light" : "dark");
    }, []);

    const value = useMemo<ThemeContextContent>(() => ({
        theme,
        setTheme,
        toggleTheme,
    }), [setTheme, theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}

export {ThemeProvider, useTheme};
