import React, { useState } from "react";
import {
  FlatList,
  ActivityIndicator,
  Modal,
  View,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { charactersViewModel } from "../../viewmodels/CharacterListViewModel";

// Estilização com Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const CharacterItem = styled.View`
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

const FilterButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-left: 8px;
  font-weight: bold;
`;

const EmptyListMessage = styled.Text`
  text-align: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 8px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  margin-left: 8px;
`;

const CloseButton = styled.TouchableOpacity`
  align-items: center;
  margin-top: 12px;
`;

const FilterSection: React.FC<{
  name: string;
  status: string;
  species: string;
  gender: string;
  setName: (value: string) => void;
  setStatus: (value: string) => void;
  setSpecies: (value: string) => void;
  setGender: (value: string) => void;
  applyFilters: () => void;
  closeModal: () => void;
}> = ({
  name,
  status,
  species,
  gender,
  setName,
  setStatus,
  setSpecies,
  setGender,
  applyFilters,
  closeModal,
}) => {
  const theme = useTheme();

  return (
    <ModalContainer>
      <InputContainer>
        <Ionicons name="person" size={20} color={theme.colors.text} />
        <StyledInput
          placeholder="Nome"
          placeholderTextColor={theme.colors.text}
          value={name}
          onChangeText={setName}
        />
      </InputContainer>

      <InputContainer>
        <Ionicons name="pulse" size={20} color={theme.colors.text} />
        <StyledInput
          placeholder="Status (alive, dead e unknown)"
          placeholderTextColor={theme.colors.text}
          value={status}
          onChangeText={setStatus}
        />
      </InputContainer>

      <InputContainer>
        <Ionicons name="earth" size={20} color={theme.colors.text} />
        <StyledInput
          placeholder="Espécie"
          placeholderTextColor={theme.colors.text}
          value={species}
          onChangeText={setSpecies}
        />
      </InputContainer>

      <InputContainer>
        <Ionicons name="male-female" size={20} color={theme.colors.text} />
        <StyledInput
          placeholder="Gênero (female, male e unknown)"
          placeholderTextColor={theme.colors.text}
          value={gender}
          onChangeText={setGender}
        />
      </InputContainer>

      <FilterButton onPress={applyFilters}>
        <Ionicons name="checkmark" size={20} color="#fff" />
        <ButtonText>Aplicar Filtros</ButtonText>
      </FilterButton>

      <CloseButton onPress={closeModal}>
        <Ionicons name="close-circle" size={28} color={theme.colors.text} />
      </CloseButton>
    </ModalContainer>
  );
};

const CharacterListView: React.FC = () => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const {
    characters,
    isLoading,
    isRefreshing,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    handleSearch,
    refreshContent,
  } = charactersViewModel();

  const applyFilters = () => {
    handleSearch({ name, status, species, gender });
    setModalVisible(false);
  };

  const renderItem = ({ item }: any) => (
    <CharacterItem>
      <View>
        <Title>{item.name}</Title>
        <Title>Status: {item.status}</Title>
        <Title>Espécie: {item.species}</Title>
        <Title>Gênero: {item.gender}</Title>
      </View>
    </CharacterItem>
  );

  return (
    <Container>
      <FilterButton onPress={() => setModalVisible(true)}>
        <Ionicons name="filter" size={20} color="#fff" />
        <ButtonText>Filtrar</ButtonText>
      </FilterButton>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : `key-${index}`
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyListMessage>Nenhum personagem encontrado</EmptyListMessage>
          }
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

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <FilterSection
          name={name}
          status={status}
          species={species}
          gender={gender}
          setName={setName}
          setStatus={setStatus}
          setSpecies={setSpecies}
          setGender={setGender}
          applyFilters={applyFilters}
          closeModal={() => setModalVisible(false)}
        />
      </Modal>
    </Container>
  );
};

export default CharacterListView;
