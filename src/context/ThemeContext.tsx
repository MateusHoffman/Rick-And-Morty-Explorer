import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getThemePreference,
  setThemePreference,
} from "../services/preferences";

// Tipagem do contexto
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Criando o contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider do Tema
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await getThemePreference();
      setTheme(storedTheme === "dark" ? "dark" : "light");
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await setThemePreference(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};
