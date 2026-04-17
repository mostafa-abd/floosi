export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  created_at: number; 
}

export interface Summary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}
