import { UpdatePasswordPayload, User } from "@/types";
import { LoginPayload, RegisterPayload } from "@/types";
import api from "@/api";
import { getUser } from "@/util";
import { Module } from "vuex";

type State = {
  user: User | undefined;
};

const auth: Module<State, any> = {
  state: () => ({
    user: getUser(),
  }),
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
  mutations: {
    removeUser(state) {
      state.user = undefined;
    },
    setUser(state, u: User) {
      state.user = u;
    },
  },
  actions: {
    async register(_, { email, name, password, provider }: RegisterPayload) {
      const res = await api.register({
        email,
        password,
        name,
        provider,
      });
      return res.data;
    },
    async login({ commit }, { email, password, provider }: LoginPayload) {
      const res = await api.login({ email, password, provider });
      const user = res.data as User;
      commit("setUser", user);
      return user;
    },
    async logout({ commit }) {
      commit("removeUser");
    },
    async updatePassword(_, params: UpdatePasswordPayload) {
      await api.updatePassword(params);
    },
    async verifyAccount(_, token: string) {
      await api.verifyAccount(token);
    },
  },
};

export default auth;
