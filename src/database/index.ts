import * as SQLite from 'expo-sqlite';
import { Transaction } from '../types';

const DB_NAME = 'floosi.db';

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL
    );
  `);
  
  return db;
};

export const database = {
  async addTransaction(transaction: Transaction) {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.runAsync(
      'INSERT INTO transactions (id, type, amount, category, note, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [transaction.id, transaction.type, transaction.amount, transaction.category, transaction.note || '', transaction.created_at]
    );
  },

  async getAllTransactions(): Promise<Transaction[]> {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const allRows = await db.getAllAsync<Transaction>('SELECT * FROM transactions ORDER BY created_at DESC');
    return allRows;
  },

  async updateTransaction(transaction: Transaction) {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.runAsync(
      'UPDATE transactions SET type = ?, amount = ?, category = ?, note = ?, created_at = ? WHERE id = ?',
      [transaction.type, transaction.amount, transaction.category, transaction.note || '', transaction.created_at, transaction.id]
    );
  },

  async deleteTransaction(id: string) {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  },

  async clearAll() {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.runAsync('DELETE FROM transactions');
  }
};
