import { useEffect, useState } from "react";
import SQLite from "react-native-sqlite-storage";
import {
  getDBConnection,
  createTables,
  getFavorites,
  saveFavorite,
  removeFavorite,
  isFavorite,
} from "../services/database";

interface Favorite {
  id: number;
  type: string;
  data: any;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDB = async () => {
      const connection = await getDBConnection();
      await createTables(connection);
      setDb(connection);
      await loadFavorites(connection);
    };
    initDB();
  }, []);

  // Carrega os favoritos
  const loadFavorites = async (connection: SQLite.SQLiteDatabase) => {
    const favs = await getFavorites(connection);
    setFavorites(
      favs.map((item) => ({
        id: item.id,
        type: item.type,
        data: JSON.parse(item.data),
      }))
    );
  };

  // Força o refresh da lista de favoritos
  const refreshFavorites = async () => {
    if (!db) return;
    await loadFavorites(db);
  };

  // Adiciona ou remove um favorito
  const toggleFavorite = async (item: any, type: string) => {
    if (!db) return;

    const alreadyFav = await isFavorite(db, item.id);
    if (alreadyFav) {
      await removeFavorite(db, item.id);
    } else {
      await saveFavorite(db, item.id, type, JSON.stringify(item));
    }
    await loadFavorites(db); // Atualiza o estado local
  };

  // Verifica se o item é favorito
  const checkIfFavorite = (id: number) => {
    return favorites.some((fav) => fav.id === id);
  };

  return {
    favorites,
    toggleFavorite,
    checkIfFavorite,
    refreshFavorites, // Função para forçar o refresh
  };
};
