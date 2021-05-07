export type State = {
  user?: User;
  loginError?: boolean;
  loginSuccessful?: boolean;
  accounts?: Account[];
  transactions?: Transaction[];
  netIncome?: NetIncome[];
  transactionCategories?: TransactionCategories[];
  accountCreateSuccessful?: boolean;
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
  date: string;
  narration: string;
  displayCategory: string;
};

export type TransactionInfo = Transaction & {
  recipient: {
    name: string;
    activities: string[];
  };
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
};
