"use client";

import React, { createContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

type Theme = "dark" | "light" | "multicolour";
type Gradient = "space" | "aurora" | "sunset" | "forest";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  gradient: Gradient;
  setGradient: (gradient: Gradient) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  gradient: "space",
  setGradient: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [gradient, setGradientState] = useState<Gradient>("space");
  const [isMounted, setIsMounted] = useState(false);

  // Read theme and gradient on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && ["dark", "light", "multicolour"].includes(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      document.body.setAttribute("data-theme", savedTheme);
    }
    
    const savedGradient = localStorage.getItem("gradient") as Gradient;
    if (savedGradient && ["space", "aurora", "sunset", "forest"].includes(savedGradient)) {
      setGradientState(savedGradient);
      document.documentElement.setAttribute("data-gradient", savedGradient);
      document.body.setAttribute("data-gradient", savedGradient);
    }

    setIsMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  const setGradient = (newGradient: Gradient) => {
    setGradientState(newGradient);
    localStorage.setItem("gradient", newGradient);
    document.documentElement.setAttribute("data-gradient", newGradient);
    document.body.setAttribute("data-gradient", newGradient);
  };

  return (
    <SessionProvider>
      <ThemeContext.Provider value={{ theme, setTheme, gradient, setGradient }}>
        {children}
        <Toaster 
          theme={theme === "light" ? "light" : "dark"} 
          position="top-right" 
          closeButton 
          richColors 
        />
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
