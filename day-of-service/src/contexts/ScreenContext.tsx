import { createContext, useContext, useState } from "react";
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
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const changeScreen = (screen: string) => setCurrentScreen(screen);
    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
    return (
        <ScreenContext.Provider value={{ theme, currentScreen, changeScreen, toggleTheme }}>
            {children}
        </ScreenContext.Provider>
    );
};

export const useScreenContext = () => useContext(ScreenContext);

export default ScreenContext;