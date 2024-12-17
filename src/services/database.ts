import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite";

export interface FavoriteItem {
  id: number;
  type: string;
  data: string;
}

const DATABASE_NAME = "RickAndMorty.db";

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  try {
    console.log("Tentando abrir o banco de dados...");
    const db = await openDatabaseAsync(DATABASE_NAME);
    console.log("Banco de dados aberto com sucesso.");
    return db;
  } catch (error) {
    console.error("Erro ao abrir o banco de dados:", error);
    throw error;
  }
};

export const createTables = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        data TEXT NOT NULL
      );
    `);
    console.log("Tabela 'favorites' criada ou já existente.");
  } catch (error) {
    console.error("Erro ao criar tabela:", error);
    throw error;
  }
};

export const saveFavorite = async (
  db: SQLiteDatabase,
  id: number,
  type: string,
  data: string
): Promise<void> => {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO favorites (id, type, data) VALUES (?, ?, ?);`,
      [id, type, data]
    );
    console.log(`Favorito salvo com sucesso: ${id}`);
  } catch (error) {
    console.error("Erro ao salvar favorito:", error);
    throw error;
  }
};

export const getFavorites = async (
  db: SQLiteDatabase
): Promise<FavoriteItem[]> => {
  try {
    const rows = await db.getAllAsync<FavoriteItem>(`SELECT * FROM favorites;`);
    console.log("Favoritos carregados:", rows);
    console.log('rows:', rows)
    return rows;
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    throw error;
  }
};

export const removeFavorite = async (
  db: SQLiteDatabase,
  id: number
): Promise<void> => {
  try {
    await db.runAsync(`DELETE FROM favorites WHERE id = ?;`, [id]);
    console.log(`Favorito removido: ${id}`);
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    throw error;
  }
};

export const isFavorite = async (
  db: SQLiteDatabase,
  id: number
): Promise<boolean> => {
  try {
    const row = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM favorites WHERE id = ?;`,
      [id]
    );
    return row !== null; // Se retornar null, não é favorito
  } catch (error) {
    console.error("Erro ao verificar favorito:", error);
    throw error;
  }
};
