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
  expense?: Array<{ date: string; amount: number }>;
  revenue?: Array<{ date: string; amount: number }>;
};

export interface LoginPayload {
  email: string;
  password: string;
  provider?: "google" | "facebook" | undefined;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export type FilterParams = { accountId?: string; start?: number; end?: number };

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
  expenseCategory?: string;
  parentId?: string;
  displayAmount?: number;
};

export type TransactionModel = {
  id: string;
  displayCategory: string;
  recipientName: string[];
  isEstablishment: boolean;
  establishmentActivities: string[];
};

export type TransactionPayload = {
  id: string;
  displayCategory: string;
  recipientName: string;
  isEstablishment: boolean;
  establishmentActivities: string[];
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

export type FacebookLoginResponse = {
  authResponse: {
    accessToken: string;
    expiresIn: number;
    userId: string;
  };
  status: string;
};

export type SplitTransaction = {
  expenseCategory: string;
  amount: number;
  id: string;
};
