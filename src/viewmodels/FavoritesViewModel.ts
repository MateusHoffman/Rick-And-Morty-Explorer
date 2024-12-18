import { useEffect, useState, useCallback } from "react";
import * as SQLite from "expo-sqlite";
import {
  getDBConnection,
  createTables,
  getFavorites,
  saveFavorite,
  removeFavorite,
  isFavorite,
} from "../services/database";

// Tipagem de um item favorito
interface Favorite {
  id: number;
  type: string;
  data: any;
}

// Tipagem para o SQLiteDatabase do expo-sqlite
type Database = SQLite.SQLiteDatabase;

// Hook de gerenciamento de favoritos
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [db, setDb] = useState<Database | null>(null);

  // Inicialização do banco de dados
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const connection = await getDBConnection();
        await createTables(connection);
        setDb(connection as Database);
        await loadFavorites(connection as Database);
      } catch (error) {
        console.error("Erro ao inicializar banco de dados:", error);
      }
    };

    initializeDatabase();
  }, []);

  // Carrega os favoritos do banco e atualiza o estado local
  const loadFavorites = useCallback(async (connection: Database) => {
    try {
      const favoritesFromDB = await getFavorites(connection);
      const parsedFavorites = favoritesFromDB.map((item) => ({
        id: item.id,
        type: item.type,
        data: JSON.parse(item.data),
      }));
      setFavorites(parsedFavorites);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }, []);

  // Força o refresh da lista de favoritos
  const refreshFavorites = useCallback(async () => {
    if (!db) return;
    await loadFavorites(db);
  }, [db, loadFavorites]);

  // Adiciona ou remove um item da lista de favoritos
  const toggleFavorite = useCallback(
    async (item: any, type: string) => {
      if (!db) return;

      try {
        const alreadyFav = await isFavorite(db, item.id);

        if (alreadyFav) {
          await removeFavorite(db, item.id);
        } else {
          await saveFavorite(db, item.id, type, JSON.stringify(item));
        }

        await loadFavorites(db);
      } catch (error) {
        console.error("Erro ao alternar favorito:", error);
      }
    },
    [db, loadFavorites]
  );

  // Verifica se um item específico está nos favoritos
  const checkIfFavorite = useCallback(
    (id: number) => favorites.some((fav) => fav.id === id),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    checkIfFavorite,
    refreshFavorites,
  };
};
