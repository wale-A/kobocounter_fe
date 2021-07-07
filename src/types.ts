export type State = {
  user: User | undefined;
  accounts: Account[] | undefined;
  transactions: TransactionInfo[] | undefined;
  netIncome: NetIncome[] | undefined;
  transactionCategories: TransactionCategories[] | undefined;
  accountCreateSuccessful: boolean | undefined;
  recurringExpenditure: RecurrentExpense[] | undefined;
  establishmentActivities: EstablishmentActivity[] | undefined;
  establishments: Record<string, string[]> | undefined;
};

export type User = {
  id: string;
  email: string;
  name: string;
  token: { token: string; expires: number };
};

export type Account = {
  id: string;
  status: string;
  accountNumber: string;
  currency: string;
  type: string;
  balance: number;
  bankName: string;
};

export type Transaction = {
  id: string;
  amount: number;
  date: number;
  narration: string;
  displayCategory: string;
  bank?: string;
};

export type TransactionInfo = Transaction & {
  establishment: {
    name: string;
    activities: string[];
  };
  recipient: string;
};

export type NetIncome = {
  date: string;
  amount: number;
};

export type TransactionCategories = {
  category: number;
  count: number;
  amount: number;
  displayCategory: string;
  shortText: string;
};

export type RecurrentExpense = {
  narration: string;
  frequency: number;
  transactionCategory?: string;
  transactions?: Transaction[];
};

export type EstablishmentActivity = {
  activity: string;
  transactionIds: string[];
};
