import { create } from 'zustand';
import { Transaction, Summary } from '../types';
import { database } from '../database';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearData: () => Promise<void>;
  
  // Computed (Getters)
  getSummary: () => Summary;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const transactions = await database.getAllTransactions();
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTransaction: async (data) => {
    const newTransaction: Transaction = {
      ...data,
      id: Math.random().toString(36).substring(2, 15),
      created_at: Date.now(),
    };
    
    try {
      await database.addTransaction(newTransaction);
      const transactions = await database.getAllTransactions();
      set({ transactions });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateTransaction: async (transaction) => {
    try {
      await database.updateTransaction(transaction);
      const transactions = await database.getAllTransactions();
      set({ transactions });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteTransaction: async (id) => {
    try {
      await database.deleteTransaction(id);
      const transactions = await database.getAllTransactions();
      set({ transactions });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  clearData: async () => {
    try {
      await database.clearAll();
      set({ transactions: [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  getSummary: () => {
    const transactions = get().transactions;
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
    };
  },
}));
