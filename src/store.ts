import superagent from "superagent";
import { createStore } from "vuex";
import {
  Account,
  NetIncome,
  State,
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
    };
  },
  mutations: {
    setLoginStatus(state: State, status: boolean) {
      state.loginSuccessful = status;
    },
    setLoginError(state: State) {
      state.loginError = true;
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
  }, // END OF MUTATION
  actions: {
    async loginUser(
      _,
      { email, password }: { email: string; password: string }
    ) {
      try {
        console.log("loggin user in");
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

          console.log(res.body);
        }
      } catch (e) {
        this.commit("setLoginError");
      }
    },
    async getAccounts(_) {
      try {
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/accounts`)
          .auth(this.state.user?.token.token, { type: "bearer" });
        this.commit("setAccounts", res.body as Account[]);
      } catch (e) {
        this.commit("setAccounts", []);
      }
    },
    async getTransactions(_, { accountId }: { accountId?: string }) {
      try {
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/accounts/transactions`)
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId });
        this.commit("setTransactions", res.body as Account[]);
      } catch (e) {
        this.commit("setTransactions", []);
      }
    },
    async getNetIncome(_, { accountId }: { accountId?: string }) {
      try {
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(`${process.env.VUE_APP_API_URL}/banking/accounts/netincome`)
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId });
        this.commit("setNetIncome", res.body as NetIncome[]);
      } catch (e) {
        this.commit("setNetIncome", []);
      }
    },
    async getTransactionCategories(_, { accountId }: { accountId?: string }) {
      try {
        if (!this.state.user) return undefined;

        const res = await superagent
          .get(
            `${process.env.VUE_APP_API_URL}/banking/accounts/transactions/categories`
          )
          .auth(this.state.user?.token.token, { type: "bearer" })
          .query({ accountId });
        this.commit(
          "setTransactionCategories",
          res.body as TransactionCategories[]
        );
      } catch (e) {
        this.commit("setTransactionCategories", []);
      }
    },
  }, // END OF ACTION
  getters: {
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
  },
});
