import { useState, useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import debounce from "lodash.debounce";
import { fetchEpisodes } from "../services/api";
import { useFavorites } from "./FavoritesViewModel";

interface EpisodesViewModelParams {
  name?: string;
}

export const episodesViewModel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleFavorite, checkIfFavorite } = useFavorites();

  // Query com paginação baseada no novo formato da API
  const {
    data,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isRefetching,
  } = useInfiniteQuery(
    ["episodes", searchQuery],
    async ({ pageParam = 1 }) => {
      const response = await fetchEpisodes({
        name: searchQuery,
        page: pageParam,
      });
      return {
        results: response.results,
        nextPage: response.info.next ? pageParam + 1 : null,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  // Função de busca otimizada com debounce
  const debouncedSearch = useCallback(
    debounce((text: string) => setSearchQuery(text), 300),
    []
  );

  const handleSearch = (text: string) => {
    debouncedSearch(text);
    refetch();
  };

  const refreshContent = async () => {
    await refetch();
  };

  return {
    episodes: data?.pages.flatMap((page) => page.results) || [],
    isLoading,
    isRefreshing: isRefetching,
    handleSearch,
    fetchNextPage,
    hasNextPage: Boolean(data?.pages.at(-1)?.nextPage),
    isFetchingNextPage,
    toggleFavorite,
    checkIfFavorite,
    refreshContent,
  };
};
