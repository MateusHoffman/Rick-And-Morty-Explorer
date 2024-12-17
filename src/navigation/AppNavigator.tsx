import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EpisodeListView from "../views/EpisodeList/EpisodeListView";
import CharacterListView from "../views/CharacterList/CharacterListView";
import FavoritesView from "../views/Favorites/FavoritesView";
import SettingsView from "../views/Settings/SettingsView";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "information-circle";

            if (route.name === "Episódios") {
              iconName = "list";
            } else if (route.name === "Personagens") {
              iconName = "people";
            } else if (route.name === "Favoritos") {
              iconName = "heart";
            } else if (route.name === "Configurações") {
              iconName = "settings";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Episódios" component={EpisodeListView} />
        <Tab.Screen name="Personagens" component={CharacterListView} />
        <Tab.Screen name="Favoritos" component={FavoritesView} />
        <Tab.Screen name="Configurações" component={SettingsView} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
