import { createStore } from "vuex";
import router from "./router";
import {
  Account,
  NetIncome,
  State,
  RecurrentExpense,
  TransactionCategories,
  User,
  TransactionInfo,
} from "./types";
import axios from "axios";
import { unauthorizedInterceptor } from "./_helpers/axiosInterceptor";

// add unauthorized interceptor to all axios requests
unauthorizedInterceptor();

export const store = createStore({
  state() {
    return {
      user:
        (JSON.parse(
          localStorage.getItem("authenticated-user") || "null"
        ) as User) || undefined,
      loginError: undefined,
      loginSuccessful: undefined,
      accounts: undefined,
      netIncome: undefined,
      transactions: undefined,
      transactionCategories: undefined,
      accountCreateSuccessful: undefined,
      recurringExpenditure: undefined,
      establishmentActivities: undefined,
      establishments: undefined,
      activities: undefined,
    };
  },
  mutations: {
    logoutUser(state: State) {
      localStorage.removeItem("authenticated-user");
      state.user = undefined;
      router.replace({ name: "Home" });
    },
    setAccountCreateStatus(state: State, status: boolean) {
      state.accountCreateSuccessful = status;
    },
    setUser(state: State, u: User) {
      state.user = u;
    },
    setAccounts(state: State, accounts?: Account[]) {
      state.accounts = accounts;
    },
    setTransactions(state: State, transactions?: TransactionInfo[]) {
      state.transactions = transactions;
    },
    setNetIncome(state: State, netIncome?: NetIncome[]) {
      state.netIncome = netIncome;
    },
    setTransactionCategories(
      state: State,
      categories?: TransactionCategories[]
    ) {
      state.transactionCategories = categories;
    },
    setRecurringExpenses(state: State, subscription?: RecurrentExpense[]) {
      state.recurringExpenditure = subscription;
    },
    setEstablishmentActivities(state: State, activities?: []) {
      state.establishmentActivities = activities;
    },
    setEstablishments(state: State, establishments?: Record<string, string[]>) {
      state.establishments = establishments;
    },
    insertActivity(
      state: State,
      { establishment, activity }: { establishment: string; activity: string }
    ) {
      if (state.establishments && state.establishments[establishment]) {
        state.establishments[establishment].push(activity);
      }
    },
    insertEstablishment(state: State, establishment: string) {
      if (!state.establishments) {
        state.establishments = {};
      }
      state.establishments[establishment] = [];
    },
    updateTransaction(state: State, updatedTransaction: TransactionInfo) {
      if (!(state.transactions && state.transactions.length > 0)) return;

      const index = state.transactions.findIndex(
        (x: TransactionInfo) => x.id === updatedTransaction.id
      );
      if (index == -1) return;
      state.transactions.splice(index, 1, updatedTransaction);
    },
  }, // END OF MUTATION
  actions: {
    async registerUser(
      _,
      {
        email,
        name,
        password,
        callback,
      }: {
        email: string;
        name: string;
        password: string;
        callback: (err: Error | null, val: boolean, message?: string) => void;
      }
    ) {
      try {
        const res = await axios.post(`${process.env.VUE_APP_API_URL}/users`, {
          email,
          password,
          name,
        });

        if (res.status !== 200) {
          return callback(null, false, res.data);
        }
        return callback(null, true);
      } catch (e) {
        return callback(e as Error, false);
      }
    },
    async loginUser(
      _,
      {
        email,
        password,
        callback,
      }: {
        email: string;
        password: string;
        callback: (err: Error | null, val: boolean, message?: string) => void;
      }
    ) {
      try {
        this.commit("setLoginStatus", undefined);
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/users/login`,
          { email, password }
        );

        if (res.status !== 200) {
          return callback(null, false, res.data);
        } else {
          localStorage.setItem("authenticated-user", JSON.stringify(res.data));
          this.commit("setUser", res.data as User);
          return callback(null, true);
        }
      } catch (e) {
        return callback(e as Error, false);
      }
    },
    async addAccount(_, { code }: { code: string }) {
      try {
        if (!this.state.user) throw "";

        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/banking/accounts`,
          { code },
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
          }
        );

        this.commit("setAccountCreateStatus", true);
      } catch (e) {
        this.commit("setAccountCreateStatus", false);
      }
    },
    async getAccounts(_) {
      try {
        if (!this.state.user) throw "";

        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/banking/accounts`,
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
          }
        );

        this.commit("setAccounts", res.data as Account[]);
      } catch (e) {
        this.commit("setAccounts", []);
      }
    },
    async getTransactions(
      _,
      {
        accountId,
        start,
        end,
      }: { accountId?: string; start?: number; end?: number }
    ) {
      try {
        if (!this.state.user) throw "";

        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/banking/accounts/transactions`,
          {
            params: { accountId, start, end },
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
          }
        );

        this.commit("setTransactions", res.data as Account[]);
      } catch (e) {
        this.commit("setTransactions", []);
      }
    },
    async getNetIncome(
      _,
      {
        accountId,
        start,
        end,
      }: { accountId?: string; start?: number; end?: number }
    ) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/banking/accounts/netincome`,
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
            params: { accountId, start, end },
          }
        );

        this.commit("setNetIncome", res.data as NetIncome[]);
      } catch (e) {
        this.commit("setNetIncome", []);
      }
    },
    async getRecurringExpenses(_, { accountId }: { accountId?: string }) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/banking/accounts/recurrentExpenses`,
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
            params: { accountId },
          }
        );

        this.commit("setRecurringExpenses", res.data as RecurrentExpense[]);
      } catch (e) {
        this.commit("setRecurringExpenses", []);
      }
    },
    async getEstablishmentActivities(
      _,
      {
        accountId,
        start,
        end,
      }: { accountId?: string; start?: number; end?: number }
    ) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/banking/establishmentActivities`,
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
            params: { accountId, start, end },
          }
        );

        this.commit("setEstablishmentActivities", res.data);
      } catch (e) {
        this.commit("setEstablishmentActivities", []);
      }
    },
    async getTransactionCategories(
      _,
      {
        accountId,
        start,
        end,
      }: { accountId?: string; start?: number; end?: number }
    ) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/banking/accounts/transactions/categories`,
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
            params: { accountId, start, end },
          }
        );

        this.commit(
          "setTransactionCategories",
          res.data as TransactionCategories[]
        );
      } catch (e) {
        this.commit("setTransactionCategories", []);
      }
    },
    async subscribeUser(_, { subscription }: { subscription: string }) {
      try {
        await axios.post(
          `${process.env.VUE_APP_API_URL}/users/subscription`,
          { subscription },
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
          }
        );
      } catch (e) {
        // console.log()
      }
    },
    async deleteSubscription(_, { subscription }: { subscription: string }) {
      try {
        await axios.delete(
          `${process.env.VUE_APP_API_URL}/users/subscription`,
          { data: { subscription } }
        );
      } catch (e) {
        // console.log(e)
      }
    },
    async getEstablishments() {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/banking/establishments`
        );

        this.commit("setEstablishments", res.data as string[]);
      } catch (e) {
        this.commit("setEstablishments", []);
      }
    },
    async updateTransaction(
      _,
      {
        transactionId,
        params,
        updatedTransaction,
        callback,
      }: {
        transactionId: string;
        params: string;
        updatedTransaction: TransactionInfo;
        callback: (success: boolean) => void;
      }
    ) {
      try {
        await axios.put(
          `${process.env.VUE_APP_API_URL}/banking/transactions/${transactionId}`,
          params,
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
          }
        );

        this.commit("updateTransaction", updatedTransaction);
        callback(true);
      } catch (e) {
        callback(false);
      }
    },
    async generateAccountReAuthCode(
      _,
      {
        accountId,
        callback,
      }: {
        accountId: string;
        callback: (token?: string) => void;
      }
    ) {
      try {
        // await axios
        //   .post(
        //     `${process.env.VUE_APP_API_URL}/banking/account/${accountId}/reauthorize`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${this.state.user?.token?.token}`,
        //       },
        //     }
        //   )

        //   callback(res.data.token);

        callback("VwxcfeLRZvq1UlD5WiuN");
      } catch (e) {
        console.error(e);
        // toastr.error("Unable to generate re-authorization token");
        callback(undefined);
      }
    },
    async deleteAccount(
      _,
      {
        accountId,
        callback,
      }: {
        accountId: string;
        callback: (e: Error | null) => void;
      }
    ) {
      try {
        await axios.delete(
          `${process.env.VUE_APP_API_URL}/banking/account/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${this.state.user?.token?.token}`,
            },
          }
        );

        callback(null);
      } catch (e) {
        console.error(e);
        callback(e as Error);
      }
    },
  }, // END OF ACTION
  getters: {
    loginError(state: State) {
      return state.loginError;
    },
    loginSuccessful(state: State) {
      return state.loginSuccessful;
    },
    isLoggedIn(state: State) {
      return state.user && (state.user?.token?.expires || 0) > Date.now();
    },
    avatarUrl(state: State) {
      return `https://ui-avatars.com/api/?background=007cff&color=fff&rounded=true&size=32&format=svg&name=${state.user?.name?.slice(
        0,
        2
      )}`;
    },
    accounts(state: State) {
      return state.accounts;
    },
    transactions(state: State) {
      return state.transactions;
    },
    income(state: State) {
      return state.netIncome;
    },
    transactionCategories(state: State) {
      return state.transactionCategories;
    },
    accountCreateStatus(state: State) {
      return state.accountCreateSuccessful;
    },
    recurrentExpenses(state: State) {
      return state.recurringExpenditure || [];
    },
    establishmentActivities(state: State) {
      return state.establishmentActivities || [];
    },
    establishments(state: State) {
      return state.establishments || {};
    },
  },
});
