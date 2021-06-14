import superagent from "superagent";
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
    setLoginStatus(state: State, status: boolean) {
      state.loginSuccessful = status;
    },
    logoutUser(state: State) {
      localStorage.removeItem("authenticated-user");
      state.user = undefined;
      router.replace({ name: "Home" });
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
    setActivities(state: State, activities?: []) {
      state.activities = activities;
    },
    setEstablishments(state: State, establishments?: []) {
      state.establishments = establishments;
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

        const res = await superagent
          .post(`${process.env.VUE_APP_API_URL}/banking/accounts`)
          .auth(this.state.user?.token?.token, { type: "bearer" })
          .send({ code })
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit("setAccountCreateStatus", true);
        }
      } catch (e) {
        this.commit("setAccountCreateStatus", false);
      }
    },
    async getAccounts(_) {
      try {
        if (!this.state.user) throw "";

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/accounts`)
          .auth(this.state.user?.token.token, { type: "bearer" })
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit("setAccounts", res.body as Account[]);
        }
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
          .query({ accountId, start, end })
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit("setTransactions", res.body as Account[]);
        }
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
          .query({ accountId, start, end })
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit("setNetIncome", res.body as NetIncome[]);
        }
      } catch (e) {
        this.commit("setNetIncome", []);
      }
    },
    async getRecurringExpenses(_, { accountId }: { accountId?: string }) {
      try {
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(
            `${process.env.VUE_APP_API_URL}/banking/accounts/recurrentExpenses`
          )
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId })
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit("setRecurringExpenses", res.body as RecurrentExpense[]);
        }
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
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/establishmentActivities`)
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId, start, end })
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit("setEstablishmentActivities", res.body);
        }
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
          .query({ accountId, start, end })
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit(
            "setTransactionCategories",
            res.body as TransactionCategories[]
          );
        }
      } catch (e) {
        this.commit("setTransactionCategories", []);
      }
    },
    async subscribeUser(_, { subscription }: { subscription: string }) {
      if (!this.state.user) return undefined;
      try {
        const res = await superagent
          .post(`${process.env.VUE_APP_API_URL}/users/subscribe`)
          .auth(this.state.user?.token.token, { type: "bearer" })
          .send({ subscription })
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          // this.commit("setRecurringExpenses", res.body as RecurrentExpense[]);
        }
      } catch (e) {
        // this.commit("setRecurringExpenses", []);
      }
    },
    async getActivities() {
      try {
        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/activities`)
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit("setActivities", res.body as string[]);
        }
      } catch (e) {
        this.commit("setActivities", []);
      }
    },
    async getEstablishments() {
      try {
        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/establishments`)
          .ok((r) => r.status < 500);

        if (res.status == 401) {
          this.commit("logoutUser");
        } else {
          this.commit("setEstablishments", res.body as string[]);
        }
      } catch (e) {
        this.commit("setEstablishments", []);
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
      return state.establishments || [];
    },
    activities(state: State) {
      return state.activities || [];
    },
  },
});
