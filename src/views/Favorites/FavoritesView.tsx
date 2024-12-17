import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFavorites } from "../../viewmodels/FavoritesViewModel";
import styled, { useTheme } from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const FavoriteItem = styled.View`
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

const FavoritesView = () => {
  const theme = useTheme();
  const { favorites, refreshFavorites } = useFavorites();
  const [refreshing, setRefreshing] = React.useState(false);

  // Função para forçar o refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshFavorites(); // Força o reload da lista
    setRefreshing(false);
  };

  return (
    <Container>
      {favorites.length === 0 ? (
        <Title>Nenhum favorito encontrado</Title>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FavoriteItem>
              <Title>{item.data.episode}</Title>
              <Title>{item.data.name}</Title>
            </FavoriteItem>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh} // Chama o refresh manual
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </Container>
  );
};

export default FavoritesView;
