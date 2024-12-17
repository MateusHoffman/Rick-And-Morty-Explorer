import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AppNavigator from "./navigation/AppNavigator";
import { ThemeProvider } from "styled-components/native";
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from "./context/ThemeContext";
import { DefaultTheme, DarkTheme } from "./styles/themes";
import { StatusBar } from "react-native";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <ThemeWrapper />
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};

const ThemeWrapper = () => {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      {/* Ajusta a StatusBar conforme o tema */}
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"} // Cor do conteúdo da StatusBar
        backgroundColor={"transparent"} // Cor de fundo da StatusBar no Android
        animated={true}
        translucent={true} // Translúcido na StatusBar no iOS
      />
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
