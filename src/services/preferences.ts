import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "theme_preference";

// Tipagem avançada para os temas
type ThemeType = "light" | "dark";

// Função para obter a preferência do tema de forma robusta
export const getThemePreference = async (): Promise<ThemeType> => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    if (theme === "dark" || theme === "light") {
      return theme;
    }
    return "light"; // Fallback seguro
  } catch (error) {
    console.error("Erro ao obter a preferência de tema:", error);
    return "light"; // Em caso de falha, retorna o tema padrão
  }
};

// Função para definir a preferência do tema com tratamento de erros
export const setThemePreference = async (theme: ThemeType): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Erro ao salvar a preferência de tema:", error);
    throw new Error("Falha ao salvar a preferência de tema.");
  }
};
