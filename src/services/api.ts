import axios from "axios";

const API_BASE_URL = "https://rickandmortyapi.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchCharacters = async (params: any) => {
  const response = await api.get("/character", { params });
  return response.data;
};

export const fetchEpisodes = async ({ name = "", page = 1 }) => {
  const response = await axios.get(`${API_BASE_URL}/episode`, {
    params: { name, page },
  });
  return response.data;
};
