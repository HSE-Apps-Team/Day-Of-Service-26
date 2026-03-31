import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type ScreenContextType = {
    theme: "light" | "dark";
    currentScreen: string;
    changeScreen: (screen: string) => void;
    toggleTheme: () => void;
};

const ScreenContext = createContext<ScreenContextType>({
    theme: "light",
    currentScreen: "home",
    changeScreen: () => {},
    toggleTheme: () => {},
});

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
    const [currentScreen, setCurrentScreen] = useState("home");
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        try {
            const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
            if (saved === 'light' || saved === 'dark') return saved;
            if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        } catch (e) {
        }
        return 'light';
    });

    const changeScreen = (screen: string) => setCurrentScreen(screen);
    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    useEffect(() => {
        try {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        } catch (e) {
        }
    }, [theme]);
    return (
        <ScreenContext.Provider value={{ theme, currentScreen, changeScreen, toggleTheme }}>
            {children}
        </ScreenContext.Provider>
    );
};

export const useScreenContext = () => useContext(ScreenContext);

export default ScreenContext;