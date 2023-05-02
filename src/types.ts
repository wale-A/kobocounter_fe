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

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export type FilterParams = {
  accountId?: string;
  start?: number;
  end?: number;
  category?: string;
  // set either page or size to -1 to get all the records
  page?: number;
  size?: number;
  expenses?: boolean;
  search?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  token: { token: string; expires: number };
};

export type Account = {
  id: string;
  status: "AVAILABLE" | "PROCESSING" | "FAILED";
  accountNumber: string;
  currency: string;
  type: string;
  balance: number;
  bankName: string;
};

export type TransactionPayload = {
  id: string;
  transactionCategory: number;
  expenseCategory?: number;
  recipientName: string | string[];
  isEstablishment: boolean;
  establishmentActivities: string[];
  modifyExistingTransactions: boolean;
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

export type TransactionInfo = Transaction & {
  establishment: {
    name: string;
    activities: string[];
  };
  recipient: string;
};

export type Pagination = {
  page: number;
  size: number;
  total: number;
};

export type TransactionResponse = {
  meta: Pagination;
  data: TransactionInfo[];
};

export type BudgetListItem = {
  id: string;
  startDate: string;
  endDate: string;
  value: number;
  amountSpent: number | null;
  name: string;
};

export type BudgetListResponse = PaginatedResponse<BudgetListItem>;

export type BudgetItem = {
  category: string;
  value: number;
  percentage: number;
  amountSpent: number | null;
};

export type Budget = {
  id: string;
  startDate: string;
  endDate: string;
  name: string;
  items: BudgetItem[];
};

export type BudgetPayload = {
  startDate: string;
  endDate: string;
  items: Partial<BudgetItem>[];
};

export type Insights = {
  id: string;
  category: string;
  amount: number;
  change: number;
  budgetAmount: number;
};

export type DetailedInsights = {
  transactions: Array<{ date: number; amount: number }>;
  budget: Array<{ date: number; amount: number }>;
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
  paid?: boolean;
};

// type Subset<T extends U, U> = U;

export type ExpenseCategories = {
  category: number;
  amount: number;
  percentage: number;
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

export type PaginatedResponse<T> = {
  meta: Pagination;
  data: T[];
};

export type LabelValueType = { value: number; label: string };
