import superagent from "superagent";
import { createStore } from "vuex";
import {
  Account,
  NetIncome,
  State,
  Subscription,
  Transaction,
  TransactionCategories,
  User,
} from "./types";

export const store = createStore({
  state() {
    return {
      user: JSON.parse(localStorage.getItem("authenticated-user") || "null"),
      loginError: undefined,
      loginSuccessful: undefined,
      accounts: undefined,
      transactions: undefined,
      transactionCategories: undefined,
      accountCreateSuccessful: undefined,
    };
  },
  mutations: {
    setLoginStatus(state: State, status: boolean) {
      state.loginSuccessful = status;
    },
    setAccountCreateStatus(state: State, status: boolean) {
      state.accountCreateSuccessful = status;
    },
    setLoginError(state: State) {
      state.loginError = false;
    },
    setUser(state: State, u: User) {
      state.user = u;
    },
    setAccounts(state: State, accounts?: Account[]) {
      state.accounts = accounts;
    },
    setTransactions(state: State, transactions?: Transaction[]) {
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
    setRecurringExpenses(state: State, subscription?: Subscription[]) {
      state.recurringExpenditure = subscription;
    },
    setEstablishmentActivities(state: State, activities?: []) {
      state.establishmentActivities = activities;
    },
  }, // END OF MUTATION
  actions: {
    async loginUser(
      _,
      { email, password }: { email: string; password: string }
    ) {
      try {
        this.commit("setLoginStatus", undefined);
        const res = await superagent
          .post(`${process.env.VUE_APP_API_URL}/users/login`)
          .send({ email, password })
          .ok((res) => res.status < 500);

        if (res.status !== 200) {
          this.commit("setLoginStatus", false);
        } else {
          localStorage.setItem("authenticated-user", JSON.stringify(res.body));
          this.commit("setUser", res.body as User);
          this.commit("setLoginStatus", true);
        }
      } catch (e) {
        this.commit("setLoginError");
      }
    },
    async addAccount(_, { code }: { code: string }) {
      try {
        if (!this.state.user) throw "";

        await superagent
          .post(`${process.env.VUE_APP_API_URL}/banking/accounts`)
          .auth(this.state.user?.token?.token, { type: "bearer" })
          .send({ code });
        this.commit("setAccountCreateStatus", true);
      } catch (e) {
        this.commit("setAccountCreateStatus", false);
      }
    },
    async getAccounts(_) {
      try {
        if (!this.state.user) throw "";

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/accounts`)
          .auth(this.state.user?.token.token, { type: "bearer" });
        this.commit("setAccounts", res.body as Account[]);
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

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/accounts/transactions`)
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId, start, end });
        this.commit("setTransactions", res.body as Account[]);
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
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/accounts/netincome`)
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId, start, end });
        this.commit("setNetIncome", res.body as NetIncome[]);
      } catch (e) {
        this.commit("setNetIncome", []);
      }
    },
    async getRecurringExpenses(_, { accountId }: { accountId?: string }) {
      try {
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/accounts/subscriptions`)
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId });
        this.commit("setRecurringExpenses", res.body as NetIncome[]);
      } catch (e) {
        this.commit("setRecurringExpenses", []);
      }
    },
    async getEstablishmentActivities() {
      try {
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/establishmentActivities`)
          .auth(this.state.user?.token.token, { type: "bearer" });
        this.commit("setEstablishmentActivities", res.body);
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
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(
            `${process.env.VUE_APP_API_URL}/banking/accounts/transactions/categories`
          )
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId, start, end });
        this.commit(
          "setTransactionCategories",
          res.body as TransactionCategories[]
        );
      } catch (e) {
        this.commit("setTransactionCategories", []);
      }
    },
    async subscribeUser(_) {
      console.log("in subscriber");
      if (!this.state.user) return undefined;

      navigator.serviceWorker.controller?.postMessage(
        JSON.stringify({
          type: "subscribe",
          arg: {
            token: this.state.user?.token,
          },
        })
      );
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
    subscriptions(state: State) {
      return state.recurringExpenditure || [];
    },
    establishmentActivities(state: State) {
      return state.establishmentActivities || [];
    },
  },
});
