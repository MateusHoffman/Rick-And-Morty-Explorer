import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getThemePreference,
  setThemePreference,
} from "../services/preferences";

// Tipagem avançada do contexto com valores exatos
type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => Promise<void>;
}

// Criando o contexto com fallback seguro
const ThemeContext = createContext<ThemeContextType | null>(null);

// Provider do Tema
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  // Carregar a preferência do tema do armazenamento
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await getThemePreference();
        if (storedTheme === "dark" || storedTheme === "light") {
          setTheme(storedTheme);
        }
      } catch (error) {
        console.error("Erro ao carregar preferência de tema:", error);
      }
    };
    loadTheme();
  }, []);

  // Alternar o tema de forma segura e eficiente
  const toggleTheme = useCallback(async () => {
    try {
      setTheme((prevTheme) => {
        const newTheme = prevTheme === "light" ? "dark" : "light";
        setThemePreference(newTheme).catch((err) =>
          console.error("Erro ao salvar preferência de tema:", err)
        );
        return newTheme;
      });
    } catch (error) {
      console.error("Erro ao alternar tema:", error);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o tema com segurança
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};
