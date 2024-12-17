import { useState, useEffect } from "react";
import {
  getThemePreference,
  setThemePreference,
} from "../services/preferences";

export const useSettings = () => {
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

  return { theme, toggleTheme };
};
