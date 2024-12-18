import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFavorites } from "../../viewmodels/FavoritesViewModel";
import styled, { useTheme } from "styled-components/native";

interface FavoriteItemData {
  id: number;
  data: {
    episode: string;
    name: string;
  };
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const FavoriteCard = styled.View`
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  margin-bottom: 8px;
  elevation: 2;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const EmptyMessage = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const FavoritesView: React.FC = () => {
  const theme = useTheme();
  const { favorites, refreshFavorites } = useFavorites();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshFavorites();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: FavoriteItemData }) => (
    <FavoriteCard>
      <Title>{item.data.name}</Title>
      <Subtitle>{item.data.episode}</Subtitle>
    </FavoriteCard>
  );

  return (
    <Container>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]} // Para Android
          />
        }
        ListEmptyComponent={
          <EmptyMessage>Nenhum favorito encontrado.</EmptyMessage>
        }
        ListFooterComponent={<View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default FavoritesView;
