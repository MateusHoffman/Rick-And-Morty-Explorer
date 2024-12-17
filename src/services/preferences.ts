import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "theme_preference";

export const getThemePreference = async (): Promise<string> => {
  const theme = await AsyncStorage.getItem(THEME_KEY);
  return theme || "light";
};

export const setThemePreference = async (theme: string) => {
  await AsyncStorage.setItem(THEME_KEY, theme);
};
