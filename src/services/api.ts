import axios, { AxiosInstance, AxiosResponse } from "axios";

// Definição dos tipos para a API
interface ApiParams {
  [key: string]: string | number | undefined;
}

interface ApiResponse<T> {
  results: T[];
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
}

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

// Configuração base da API
const API_BASE_URL = "https://rickandmortyapi.com/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Função genérica de requisição
const fetchData = async <T>(
  endpoint: string,
  params: ApiParams = {}
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar dados da API: ${error}`);
    throw new Error("Erro ao buscar dados da API.");
  }
};

// Função específica para buscar personagens
export const fetchCharacters = async (
  params: ApiParams
): Promise<ApiResponse<Character>> => {
  return await fetchData<Character>("/character", params);
};

// Função específica para buscar episódios
export const fetchEpisodes = async (
  params: ApiParams
): Promise<ApiResponse<Episode>> => {
  return await fetchData<Episode>("/episode", params);
};
