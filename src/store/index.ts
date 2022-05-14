import { createStore, createLogger } from "vuex";
import modules from "./modules";
import actions from "./actions";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
