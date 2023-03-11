import { COMMON_DATES, PERIOD_LABEL_MAPPING } from "@/config";
import { Account, User } from "@/types";
import { BUDGET_TYPE_OPTIONS, MONTH_NAMES } from "@/config";
import {
  getWeek,
  getWeekOfMonth,
  getQuarter,
  getMonth,
  getYear,
  format,
} from "date-fns";

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

const getPeriod = (
  options: Array<string>,
  defaultValue: string
): Record<string, any> => {
  return {
    key: "period",
    label: "Date",
    type: "select",
    placeholder: "Select an option",
    sanitizeValue(value: { name: string; start: Date; end: Date }): string {
      return value.name;
    },
    options: options.map((item: string) => ({
      value: item,
      label: PERIOD_LABEL_MAPPING[item],
      nativeValue: {
        name: item,
        ...COMMON_DATES[item],
      },
    })),
    defaultValue,
    modelDefault() {
      return {
        name: defaultValue,
        ...COMMON_DATES[defaultValue],
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
  period: getPeriod(
    [
      "yesterday",
      "last-week",
      "last-month",
      "last-quarter",
      "last-year",
      "custom",
    ],
    "last-month"
  ),
};

export const transactionFilter = {
  ...baseFilter,
  category: CATEGORIES_FIELD,
  search: TRANSACTION_FIELD,
};

export const budgetFilter = {
  period: getPeriod(
    [
      "current-month",
      "rest",
      //"continuous",
      "last-month",
      "last-quarter",
      "last-year",
      "custom",
    ],
    "rest"
  ),
  category: CATEGORIES_FIELD,
};

export const getBudgetName = (startDate: string, type: string): string => {
  const date = new Date(startDate);
  switch (type) {
    case BUDGET_TYPE_OPTIONS.WEEKLY:
      return `Week ${getWeek(date)}`;
    case BUDGET_TYPE_OPTIONS.BI_WEEKLY:
      return `${MONTH_NAMES[getMonth(date)]} WEEK-GROUP ${
        getWeekOfMonth(date) < 2 ? "1" : "2"
      }`;
    case BUDGET_TYPE_OPTIONS.BI_MONTHLY:
      return `MONTH-GROUP ${(getMonth(date) + 1) / 2}`;
    case BUDGET_TYPE_OPTIONS.QUATERLY:
      return `Quater ${getQuarter(date)}`;
    case BUDGET_TYPE_OPTIONS.MID_YEAR:
      return getMonth(date) < 6 ? `First Half` : "Second Half";
    case BUDGET_TYPE_OPTIONS.YEARLY:
      return `Year ${getYear(date)}`;
    default:
      return MONTH_NAMES[getMonth(date)];
  }
};

export const justDate = (date: string): string => {
  const [withoutTime] = date.split("T");
  return format(new Date(withoutTime), "MM/dd/yyyy");
};
