import { createLogger, createStore } from "vuex";
import actions from "./actions";
import modules from "./modules";

const debug = import.meta.env.NODE_ENV !== "production";

export default createStore({
  modules,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
