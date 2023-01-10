import { sub, startOfMonth, endOfMonth, endOfYear } from "date-fns";

export const SIDEBAR_MENU_ITEMS = [
  {
    title: "Dashboard",
    icon: {
      mobile: "/img/assets/n1.png",
      desktop: "/img/assets/1.png",
    },
    medium: {
      mobile: true,
      desktop: true,
    },
    route: { path: "/Dashboard" },
  },
  {
    title: "Insights",
    icon: {
      mobile: "/img/assets/n2.png",
      desktop: "/img/assets/2.png",
    },
    medium: {
      mobile: true,
      desktop: true,
    },
    route: { path: "/Insights" },
  },
  {
    title: "Transactions",
    icon: {
      mobile: "/img/assets/n4.png",
      desktop: "/img/assets/4.png",
    },
    medium: {
      mobile: true,
      desktop: true,
    },
    route: { path: "/Transactions" },
  },
  {
    title: "Budgets",
    icon: {
      mobile: "/img/assets/n2.png",
      desktop: "/img/assets/2.png",
    },
    medium: {
      mobile: true,
      desktop: true,
    },
    route: { path: "/Budgets" },
  },
  {
    title: "Settings",
    icon: {
      mobile: "/img/assets/n5.png",
      desktop: "/img/assets/5.png",
    },
    medium: {
      mobile: true,
      desktop: true,
    },
    route: { path: "/Settings" },
  },
] as const;

export const EXPENSE_CATEGORIES = [
  { id: 1, label: "Rent", value: "Rent" },
  { id: 2, label: "Transport", value: "Transport" },
  { id: 3, label: "Groceries", value: "Groceries" },
  { id: 4, label: "Eating Out", value: "EatingOut" },
  { id: 5, label: "Airtime", value: "Airtime" },
  { id: 6, label: "Utility", value: "Utility" },
  { id: 7, label: "Health", value: "Health" },
  { id: 8, label: "Personal Care", value: "PersonalCare" },
  { id: 9, label: "Fashion", value: "Fashion" },
  { id: 10, label: "Leisure", value: "Leisure" },
  { id: 11, label: "Debt Repayment", value: "DebtRepayment" },
  { id: 12, label: "Loans", value: "Loans" },
  {
    id: 13,
    label: "Personal Development",
    value: "PersonalDevelopment",
  },
  {
    id: 14,
    label: "Savings & Investments",
    value: "SavingsAndInvestments",
  },
  {
    id: 15,
    label: "Charity & Gifts",
    value: "CharityAndGifts",
  },
  { id: 16, label: "Vacation", value: "Vacation" },
  { id: 17, label: "Vehicle Expense", value: "VehicleExpense" },
  { id: 18, label: "House Expense", value: "HouseExpense" },
  { id: 19, label: "Child Care", value: "ChildCare" },
  { id: 20, label: "Others", value: "Others" },
];

export const TRANSACTION_CATEGORIES = [
  "Misc",
  "ATM Withdrawal",
  "Bank Charge",
  "POS Purchase",
  "WEB Purchase",
  "Airtime",
  "Mobile Data",
  "Transfer",
];

const now = new Date();
export const COMMON_DATES: Record<string, { start: Date; end: Date | string }> =
  {
    yesterday: {
      start: sub(now, { days: 1 }),
      end: now,
    },
    "current-month": {
      start: startOfMonth(now),
      end: endOfMonth(now),
    },
    rest: {
      start: startOfMonth(now),
      end: endOfYear(now),
    },
    continuous: {
      start: startOfMonth(now),
      end: "",
    },
    "last-week": {
      start: sub(now, { weeks: 1 }),
      end: now,
    },
    "last-month": {
      start: sub(now, { months: 1 }),
      end: now,
    },
    "last-quarter": {
      start: sub(now, { months: 3 }),
      end: now,
    },
    "last-year": {
      start: sub(now, { years: 1 }),
      end: now,
    },
  };

export const PERIOD_LABEL_MAPPING: Record<string, string> = {
  yesterday: "Yesterday",
  "last-week": "Past week",
  "last-month": "Past Month",
  "last-quarter": "Last 3 months",
  "last-year": "Past year",
  custom: "Custom",
  "current-month": "This Month",
  rest: "Rest of the Year",
  continuous: "Future",
};

export const BUDGET_TYPE_OPTIONS: Record<string, string> = {
  WEEKLY: "weekly",
  BI_WEEKLY: "bi-weekly",
  MONTHLY: "monthly",
  BI_MONTHLY: "bi-monthly",
  QUARTERLY: "quaterly",
  MID_YEAR: "mid-year",
  ANNUALLY: "annually",
};

export const BUDGET_TYPE_OPTIONS_LABEL: Record<string, string> = {
  [BUDGET_TYPE_OPTIONS.WEEKLY]: "Weekly",
  [BUDGET_TYPE_OPTIONS.BI_WEEKLY]: "Bi Weekly",
  [BUDGET_TYPE_OPTIONS.MONTHLY]: "Monthly",
  [BUDGET_TYPE_OPTIONS.BI_MONTHLY]: "Bi Monthly",
  [BUDGET_TYPE_OPTIONS.QUARTERLY]: "Quaterly",
  [BUDGET_TYPE_OPTIONS.MID_YEAR]: "Half Year",
  [BUDGET_TYPE_OPTIONS.ANNUALLY]: "Yearly",
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
