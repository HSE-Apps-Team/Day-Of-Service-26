import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ScreenContextType = {
    currentScreen: string;
    changeScreen: (screen: string) => void;
};

const ScreenContext = createContext<ScreenContextType>({
    currentScreen: "home",
    changeScreen: () => {},
});

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
    const [currentScreen, setCurrentScreen] = useState("home");
    const changeScreen = (screen: string) => setCurrentScreen(screen);
    return (
        <ScreenContext.Provider value={{ currentScreen, changeScreen }}>
            {children}
        </ScreenContext.Provider>
    );
};

export const useScreenContext = () => useContext(ScreenContext);

export default ScreenContext;