import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { FC } from 'react';
import { useScreenContext } from './ScreenContext';
import { LightTheme, DarkTheme } from './themes';

type ThemeType = typeof LightTheme | typeof DarkTheme;

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};


export const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { theme: mode, toggleTheme: toggleAppTheme } = useScreenContext();

  const theme: ThemeType = mode === 'dark' ? DarkTheme : LightTheme;

  const toggleTheme = () => {
    toggleAppTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
