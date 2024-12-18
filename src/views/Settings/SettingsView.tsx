import React, { FC } from "react";
import { Switch } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import styled from "styled-components/native";

// Estilização
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
`;

const SettingsView: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Container>
      <Row>
        <Title>Tema Escuro</Title>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ false: "#A0A0A0", true: "#4A90E2" }}
          thumbColor={theme === "dark" ? "#FFD700" : "#FFFFFF"}
          ios_backgroundColor="#A0A0A0"
        />
      </Row>
    </Container>
  );
};

export default SettingsView;
