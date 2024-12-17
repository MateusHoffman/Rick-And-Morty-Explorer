import { useEffect, useState } from "react";
import {
  getDBConnection,
  createTables,
  getFavorites,
  saveFavorite,
  removeFavorite,
  isFavorite,
} from "../services/database";
import { SQLiteDatabase } from "expo-sqlite";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDB = async () => {
      const database = await getDBConnection();
      await createTables(database);
      setDb(database);
      loadFavorites();
    };
    initDB();
  }, []);

  const loadFavorites = async () => {
    try {
      if (!db) return
      const favs = await getFavorites(db);
      setFavorites(
        favs.map((item) => ({
          id: item.id,
          type: item.type,
          data: JSON.parse(item.data),
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  const toggleFavorite = async (item: any, type: string) => {
    const isAlreadyFavorite = await isFavorite(db, item.id);
    if (isAlreadyFavorite) {
      await removeFavorite(db, item.id);
    } else {
      await saveFavorite(db, item.id, type, JSON.stringify(item));
    }
    await loadFavorites();
  };

  const checkIfFavorite = (id: number) => {
    return favorites.some((fav) => fav.id === id);
  };

  return {
    favorites,
    toggleFavorite,
    checkIfFavorite,
  };
};
