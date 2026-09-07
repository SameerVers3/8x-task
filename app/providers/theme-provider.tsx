"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  ThemePreset,
  themePresets,
  getThemeById,
  applyThemeToCSS,
} from "@/lib/themes";

interface ThemeContextType {
  theme: ThemePreset;
  setTheme: (id: string) => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreset>(themePresets[0]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("8x-theme");
    if (saved) {
      const t = getThemeById(saved);
      setThemeState(t);
      applyThemeToCSS(t);
    } else {
      applyThemeToCSS(themePresets[0]);
    }
    setIsReady(true);
  }, []);

  const setTheme = (id: string) => {
    const t = getThemeById(id);
    setThemeState(t);
    applyThemeToCSS(t);
    localStorage.setItem("8x-theme", id);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
