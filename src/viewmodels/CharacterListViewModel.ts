import { useState, useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import debounce from "lodash.debounce";
import { fetchCharacters } from "../services/api";

interface CharacterQueryParams {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

export const charactersViewModel = () => {
  const [queryParams, setQueryParams] = useState<CharacterQueryParams>({});

  // Lógica de paginação e busca de personagens
  const {
    data,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isRefetching,
  } = useInfiniteQuery(
    ["characters", queryParams],
    async ({ pageParam = 1 }) => {
      const response = await fetchCharacters({
        ...queryParams,
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

  // Debounce para otimizar os filtros
  const debouncedSearch = useCallback(
    debounce((params: CharacterQueryParams) => setQueryParams(params), 300),
    []
  );

  const handleSearch = (params: CharacterQueryParams) => {
    debouncedSearch(params);
    refetch();
  };

  const refreshContent = async () => {
    await refetch();
  };

  return {
    characters: data?.pages.flatMap((page) => page.results) || [],
    isLoading,
    isRefreshing: isRefetching,
    handleSearch,
    fetchNextPage,
    hasNextPage: Boolean(data?.pages.at(-1)?.nextPage),
    isFetchingNextPage,
    refreshContent,
  };
};
