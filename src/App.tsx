import React, { useEffect, useCallback, useMemo } from "react";
import { QueryClient, QueryClientProvider, QueryCache } from "react-query";
import { ThemeProvider } from "styled-components/native";
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./navigation/AppNavigator";
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from "./context/ThemeContext";
import { DefaultTheme, DarkTheme } from "./styles/themes";

// Previne que a Splash Screen desapareça automaticamente
SplashScreen.preventAutoHideAsync();

// Configuração robusta do QueryClient
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Erro no React Query:", error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <AppWithSplash />
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};

const AppWithSplash: React.FC = () => {
  const { theme } = useTheme();

  const currentTheme = useMemo(
    () => (theme === "dark" ? DarkTheme : DefaultTheme),
    [theme]
  );

  // Carregamento manual da Splash Screen
  const hideSplashScreen = useCallback(async () => {
    try {
      // Simula carregamento de recursos
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Erro ao carregar recursos:", error);
    } finally {
      await SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);

  return (
    <ThemeProvider theme={currentTheme}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        animated
        translucent
      />
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
