import { COMMON_DATES } from "@/config";
import { Account, User } from "@/types";

const storeKey = "authenticated-user";

export const getUser = (): User | undefined => {
  const user = localStorage.getItem(storeKey);
  if (!user) {
    return undefined;
  }

  return JSON.parse(user);
};

export const getUserToken = (): string | undefined => {
  const user = getUser();
  if (!user) {
    return undefined;
  }

  const { token } = user;
  return token?.token;
};

export const storeUser = (user: User): void => {
  localStorage.setItem(storeKey, JSON.stringify(user));
};

export const deleteUser = (): void => {
  localStorage.removeItem(storeKey);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-GB");
};

export const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString("en-us", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ACCOUNT_FIELD = (
  accounts: { value: string; label: string }[]
): Record<string, any> => {
  return {
    key: "account",
    label: "Account",
    type: "select",
    placeholder: "Select an option",
    options: [
      {
        value: "",
        label: "All your bank accounts",
      },
      ...accounts,
      { value: "new", label: "+ Add a new account" },
    ],
    defaultValue: "",
    modelDefault: "",
    valueActions: [{ key: "new", type: "emit", props: "" }],
    getParams(model: Record<string, any>) {
      return {
        accountId: model.account,
      };
    },
  };
};

export const PERIOD_FIELD: Record<string, any> = {
  key: "period",
  label: "Date",
  type: "select",
  placeholder: "Select an option",
  sanitizeValue(value: { name: string; start: Date; end: Date }): string {
    return value.name;
  },
  options: [
    {
      value: "yesterday",
      label: "Yesterday",
      nativeValue: {
        name: "yesterday",
        ...COMMON_DATES["yesterday"],
      },
    },
    {
      value: "last-week",
      label: "Past week",
      nativeValue: {
        name: "last-week",
        ...COMMON_DATES["last-week"],
      },
    },
    {
      value: "last-month",
      label: "Last 30 days",
      nativeValue: {
        name: "last-month",
        ...COMMON_DATES["last-month"],
      },
    },
    {
      value: "last-quarter",
      label: "Last 3 months",
      nativeValue: {
        name: "last-quarter",
        ...COMMON_DATES["last-quarter"],
      },
    },
    {
      value: "last-year",
      label: "Past year",
      nativeValue: {
        name: "last-year",
        ...COMMON_DATES["last-year"],
      },
    },
    {
      value: "custom",
      label: "Custom",
    },
  ],
  defaultValue: "last-month",
  modelDefault() {
    return {
      name: "last-month",
      ...COMMON_DATES["last-month"],
    };
  },
  valueActions: [
    {
      key: "custom",
      type: "input",
      component: "RangePicker",
      props: "",
    },
  ],
  getParams(model: Record<string, any>): Record<string, string> {
    return {
      start: model.period.start.getTime(),
      end: model.period.end.getTime(),
    };
  },
};

export const TRANSACTION_FIELD: Record<string, any> = {
  key: "search",
  label: "Search",
  type: "textarea",
  placeholder: "Search with narration",
  modelDefault: "",
  getParams(model: Record<string, any>) {
    return {
      search: model.search || "",
    };
  },
  valueActions: [],
  options: [],
};

export const CATEGORIES_FIELD = (
  categories: { value: string; label: string }[]
): Record<string, any> => {
  return {
    key: "category",
    label: "Category",
    type: "select",
    placeholder: "Select an option",
    options: [...categories],
    defaultValue: [],
    modelDefault: [],
    valueActions: [],
    multiSelect: true,
    getParams(model: Record<string, any>) {
      return {
        category:
          typeof model.category === "number"
            ? model.category
            : model.category.join(","),
      };
    },
    sanitizeValue(value: number | number[]): number[] {
      return typeof value === "number" ? [value] : value;
    },
  };
};

export const baseFilter = {
  account: ACCOUNT_FIELD,
  period: PERIOD_FIELD,
};

export const transactionFilter = {
  ...baseFilter,
  category: CATEGORIES_FIELD,
  search: TRANSACTION_FIELD,
};
