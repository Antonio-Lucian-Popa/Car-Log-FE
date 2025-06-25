/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext } from 'react';
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes';

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  systemTheme: string | undefined;
  resolvedTheme: string | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}

export function useTheme() {
  // Use the hook directly from next-themes
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  
  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme,
  };
}