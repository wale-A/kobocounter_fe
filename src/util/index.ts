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

  return token.token;
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

export const getFacets = (accounts: Account[]): Record<string, any>[] => {
  return [
    {
      key: "account",
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
      valueActions: [{ key: "new", type: "emit", props: "" }],
    },
    {
      key: "period",
      type: "select",
      placeholder: "Select an option",
      sanitizeValue(value: { name: string; start: Date; end: Date }) {
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
      valueActions: [
        {
          key: "custom",
          type: "input",
          component: "RangePicker",
          props: "",
        },
      ],
    },
  ];
};
