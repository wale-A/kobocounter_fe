import { User } from "@/types";
import { LoginPayload, RegisterPayload } from "@/types";
import api from "@/api";
import router from "@/router";
import { Module } from "vuex";

type State = {
  user: User | undefined;
};

type Callback = {
  callback: (err: Error | null, val: boolean, message?: string) => void;
};

const auth: Module<State, any> = {
  state: () => ({
    user:
      (JSON.parse(
        localStorage.getItem("authenticated-user") || "null"
      ) as User) || undefined,
  }),
  mutations: {
    logoutUser(state) {
      localStorage.removeItem("authenticated-user");
      state.user = undefined;
      router.replace({ name: "Home" });
    },
    setUser(state, u: User) {
      state.user = u;
    },
  },
  actions: {
    async registerUser(
      _,
      { email, name, password, provider, callback }: RegisterPayload & Callback
    ) {
      try {
        const res = await api.register({
          email,
          password,
          name,
          provider,
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
      { commit },
      { email, password, provider, callback }: LoginPayload & Callback
    ) {
      try {
        const res = await api.login({ email, password, provider });

        if (res.status !== 200) {
          return callback(null, false, res.data);
        } else {
          localStorage.setItem("authenticated-user", JSON.stringify(res.data));
          commit("setUser", res.data as User);
          return callback(null, true);
        }
      } catch (e) {
        return callback(e as Error, false);
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.user && (state.user?.token?.expires || 0) > Date.now();
    },
    avatarUrl(state) {
      return `https://ui-avatars.com/api/?background=007cff&color=fff&rounded=true&size=32&format=svg&name=${state.user?.name?.slice(
        0,
        2
      )}`;
    },
    username(state) {
      return state.user?.name;
    },
  },
};

export default auth;
