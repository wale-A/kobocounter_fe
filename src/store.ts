import { createStore } from "vuex";
import { State, User } from "./types";

export const store = createStore({
  state() {
    return {
      user: undefined,
    };
  },
  mutations: {
    setUser(state: State, u: User) {
      state.user = u;
    },
    getUser(state: State) {
      if (state.user) return;

      const json = localStorage.getItem("authenticated-user");
      if (json) {
        const authUser = JSON.parse(json) as User;
        if (authUser && authUser.email && authUser.token) {
          state.user = authUser;
        }
      }
    },
  },
  getters: {
    isLoggedIn(state: State) {
      return !!state.user;
    },
    avatarUrl(state: State) {
      return `https://ui-avatars.com/api/?background=007cff&color=fff&rounded=true&size=32&format=svg&name=${state.user?.name?.slice(
        0,
        2
      )}`;
    },
  },
});
