import React, { useMemo } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import EpisodeListView from "../views/EpisodeList/EpisodeListView";
import CharacterListView from "../views/CharacterList/CharacterListView";
import FavoritesView from "../views/Favorites/FavoritesView";
import SettingsView from "../views/Settings/SettingsView";
import { useTheme } from "../context/ThemeContext";
import { Platform } from "react-native";

// Tipagem do tipo de rota
type TabParamList = {
  Episódios: undefined;
  Personagens: undefined;
  Favoritos: undefined;
  Configurações: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Map de ícones para evitar if/else
const ICONS_MAP: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Episódios: "list",
  Personagens: "people",
  Favoritos: "heart",
  Configurações: "settings",
};

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  // Define o tema da navegação com memoização
  const navigationTheme: NavigationTheme = useMemo(
    () =>
      theme === "dark"
        ? {
            ...NavigationDarkTheme,
            colors: {
              ...NavigationDarkTheme.colors,
              background: "#121212", // Fundo escuro ajustado
            },
          }
        : {
            ...NavigationDefaultTheme,
            colors: {
              ...NavigationDefaultTheme.colors,
              background: "#FFFFFF", // Fundo claro ajustado
            },
          },
    [theme]
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={ICONS_MAP[route.name]} size={size} color={color} />
          ),
          tabBarActiveTintColor: theme === "dark" ? "#FF9800" : "#1976D2",
          tabBarInactiveTintColor: "#888",
          tabBarStyle: {
            backgroundColor: theme === "dark" ? "#222" : "#F9F9F9",
            borderTopWidth: Platform.OS === "ios" ? 0.5 : 0,
            borderTopColor: "#DDD",
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          headerStyle: {
            backgroundColor: theme === "dark" ? "#222" : "#F9F9F9",
            shadowColor: "transparent", // Remove sombra no iOS
            elevation: 0, // Remove sombra no Android
          },
          headerTintColor: theme === "dark" ? "#FF9800" : "#1976D2",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen
          name="Episódios"
          component={EpisodeListView}
          options={{ title: "Episódios" }}
        />
        <Tab.Screen
          name="Personagens"
          component={CharacterListView}
          options={{ title: "Personagens" }}
        />
        <Tab.Screen
          name="Favoritos"
          component={FavoritesView}
          options={{ title: "Favoritos" }}
        />
        <Tab.Screen
          name="Configurações"
          component={SettingsView}
          options={{ title: "Configurações" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default React.memo(AppNavigator);
