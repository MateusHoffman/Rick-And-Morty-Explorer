import React, { useState, useCallback, useMemo } from "react";
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { episodesViewModel } from "../../viewmodels/EpisodeListViewModel";
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";

// Tipagem para os itens do episódio
interface Episode {
  id: number;
  name: string;
  episode: string;
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 8px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
`;

const EpisodeItem = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

const ResetButton = styled.TouchableOpacity`
  margin-left: 8px;
`;

const ListEmpty = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

const EpisodeListView: React.FC = () => {
  const theme = useTheme();
  const [search, setSearch] = useState<string>("");

  // ViewModel hook
  const {
    episodes,
    isLoading,
    isRefreshing,
    handleSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    toggleFavorite,
    checkIfFavorite,
    refreshContent,
  } = episodesViewModel();

  const onSearchChange = useCallback(
    (text: string) => {
      setSearch(text);
      handleSearch(text);
    },
    [handleSearch]
  );

  const resetSearch = useCallback(() => {
    setSearch("");
    handleSearch("");
  }, [handleSearch]);

  const renderItem = useCallback(
    ({ item }: { item: Episode }) => (
      <EpisodeItem entering={FadeInUp} exiting={FadeOut}>
        <View>
          <Title>{item.episode}</Title>
          <Title>{item.name}</Title>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item, "episode")}>
          <Ionicons
            name={checkIfFavorite(item.id) ? "heart" : "heart-outline"}
            size={24}
            color={checkIfFavorite(item.id) ? "red" : theme.colors.text}
          />
        </TouchableOpacity>
      </EpisodeItem>
    ),
    [checkIfFavorite, toggleFavorite, theme.colors.text]
  );

  const memoizedEpisodes = useMemo(() => episodes, [episodes]);

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <InputContainer>
          <StyledInput
            placeholder="Buscar por nome"
            placeholderTextColor={theme.colors.text}
            value={search}
            onChangeText={onSearchChange}
          />
          {search.length > 0 && (
            <ResetButton onPress={resetSearch}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.text}
              />
            </ResetButton>
          )}
        </InputContainer>
      </KeyboardAvoidingView>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={memoizedEpisodes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={isRefreshing}
          onRefresh={refreshContent}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : null
          }
          ListEmptyComponent={
            <ListEmpty>
              <EmptyText>Nenhum episódio encontrado</EmptyText>
            </ListEmpty>
          }
        />
      )}
    </Container>
  );
};

export default EpisodeListView;
