import { useState, useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import debounce from "lodash.debounce";
import { fetchCharacters } from "../services/api";

// Tipagem dos parâmetros da consulta
interface CharacterQueryParams {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

// Tipagem da estrutura de resposta da API
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
}

interface ApiResponse {
  results: Character[];
  info: {
    next: string | null;
  };
}

export const charactersViewModel = () => {
  const [queryParams, setQueryParams] = useState<CharacterQueryParams>({});

  // Função assíncrona que busca os personagens da API
  const fetchCharactersPage = async ({
    pageParam = 1,
  }): Promise<{ results: Character[]; nextPage: number | null }> => {
    const response: ApiResponse = await fetchCharacters({
      ...queryParams,
      page: pageParam,
    });
    return {
      results: response.results,
      nextPage: response.info.next ? pageParam + 1 : null,
    };
  };

  // Configuração do React Query para paginação
  const {
    data,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isRefetching,
  } = useInfiniteQuery(["characters", queryParams], fetchCharactersPage, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // Dados são considerados "frescos" por 5 minutos
    cacheTime: 1000 * 60 * 10, // Dados permanecem no cache por 10 minutos
  });

  // Debounce para otimização da busca
  const debouncedSearch = useCallback(
    debounce((params: CharacterQueryParams) => setQueryParams(params), 300),
    []
  );

  // Manipula os filtros e reinicia a busca
  const handleSearch = (params: CharacterQueryParams) => {
    debouncedSearch(params);
    refetch();
  };

  // Atualiza o conteúdo ao puxar para baixo
  const refreshContent = async () => {
    await refetch();
  };

  return {
    characters: data?.pages.flatMap((page) => page.results) || [],
    isLoading,
    isRefreshing: isRefetching,
    handleSearch,
    fetchNextPage,
    hasNextPage: Boolean(data?.pages?.slice(-1)?.[0]?.nextPage),
    isFetchingNextPage,
    refreshContent,
  };
};
