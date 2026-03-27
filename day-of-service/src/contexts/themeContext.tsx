import React, { createContext } from 'react';
import type { ReactNode } from 'react';
import type { FC } from 'react';
import { useScreenContext } from './ScreenContext';
import { LightTheme, DarkTheme } from './themes';

type ThemeType = typeof LightTheme | typeof DarkTheme;

type ThemeContextType = {
  theme: ThemeType;
  // Toggle the theme (delegates to AppContext toggle)
  toggleTheme: () => void;
};

// Provide a default value that matches the shape of ThemeContextType.
export const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

// ThemeProvider now derives the current light/dark mode from AppContext
// and exposes a toggle that delegates back to AppContext. This keeps a
// single source of truth for the 'mode' while still providing the
// concrete react-native-paper theme object to consumers.
export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { theme: mode, toggleTheme: toggleAppTheme } = useScreenContext();

  const theme: ThemeType = mode === 'dark' ? DarkTheme : LightTheme;

  const toggleTheme = () => {
    // delegate to AppContext which manages the simple 'light'|'dark' string
    toggleAppTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
