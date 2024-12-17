import React, { useState } from "react";
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

// Estilização com Styled Components
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

const EpisodeListView: React.FC = () => {
  const theme = useTheme();
  const [search, setSearch] = useState("");

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

  const onSearchChange = (text: string) => {
    setSearch(text);
    handleSearch(text);
  };

  const renderItem = ({ item }: any) => (
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
  );

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
            <ResetButton onPress={() => onSearchChange("")}>
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
          data={episodes}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : `key-${index}`
          }
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
        />
      )}
    </Container>
  );
};

export default EpisodeListView;
