import React from "react";
import { Switch } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
`;

const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Container>
      <Row>
        <Title>Tema Escuro</Title>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          trackColor={{
            false: "#767577",
            true: "#81b0ff",
          }}
          thumbColor={theme === "dark" ? "#f5dd4b" : "#f4f3f4"}
        />
      </Row>
    </Container>
  );
};

export default SettingsView;
