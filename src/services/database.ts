import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite";

interface FavoriteItem {
  id: number;
  type: string;
  data: string;
}

const DATABASE_NAME = "RickAndMorty.db";

// Conexão com o banco de dados
export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  try {
    console.log("Iniciando conexão com o banco de dados...");
    const db = await openDatabaseAsync(DATABASE_NAME);
    console.log("Conexão com banco de dados aberta com sucesso.");
    return db;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw new Error("Falha ao abrir conexão com o banco de dados.");
  }
};

// Criação de tabelas
export const createTables = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      data TEXT NOT NULL
    );
  `;
  try {
    await db.execAsync(createTableQuery);
    console.log("Tabela 'favorites' criada com sucesso.");
  } catch (error) {
    console.error("Erro ao criar tabela 'favorites':", error);
    throw new Error("Falha ao criar tabela no banco de dados.");
  }
};

// Salvar favorito no banco
export const saveFavorite = async (
  db: SQLiteDatabase,
  id: number,
  type: string,
  data: string
): Promise<void> => {
  const query = `INSERT OR REPLACE INTO favorites (id, type, data) VALUES (?, ?, ?);`;
  try {
    await db.runAsync(query, [id, type, data]);
    console.log(`Favorito adicionado/atualizado com sucesso: ID ${id}`);
  } catch (error) {
    console.error(`Erro ao salvar favorito (ID ${id}):`, error);
    throw new Error("Falha ao salvar favorito.");
  }
};

// Buscar todos os favoritos
export const getFavorites = async (
  db: SQLiteDatabase
): Promise<FavoriteItem[]> => {
  const query = `SELECT * FROM favorites;`;
  try {
    const rows = await db.getAllAsync<FavoriteItem>(query);
    console.log("Favoritos carregados com sucesso.");
    return rows;
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    throw new Error("Falha ao carregar favoritos.");
  }
};

// Remover favorito do banco
export const removeFavorite = async (
  db: SQLiteDatabase,
  id: number
): Promise<void> => {
  const query = `DELETE FROM favorites WHERE id = ?;`;
  try {
    await db.runAsync(query, [id]);
    console.log(`Favorito removido com sucesso: ID ${id}`);
  } catch (error) {
    console.error(`Erro ao remover favorito (ID ${id}):`, error);
    throw new Error("Falha ao remover favorito.");
  }
};

// Verificar se um item é favorito
export const isFavorite = async (
  db: SQLiteDatabase,
  id: number
): Promise<boolean> => {
  const query = `SELECT id FROM favorites WHERE id = ?;`;
  try {
    const result = await db.getFirstAsync<{ id: number }>(query, [id]);
    const isFav = result !== null;
    console.log(`Verificação de favorito (ID ${id}): ${isFav}`);
    return isFav;
  } catch (error) {
    console.error(`Erro ao verificar favorito (ID ${id}):`, error);
    throw new Error("Falha ao verificar favorito.");
  }
};
