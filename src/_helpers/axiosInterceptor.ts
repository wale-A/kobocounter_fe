import axios from "axios";
import { store } from "@/store";

export function unauthorizedInterceptor(): void {
  axios.interceptors.response.use(undefined, (error) => {
    const { response } = error;
    if (response) {
      if ([401, 403].includes(response.status)) {
        store.commit("logoutUser");
      }
    }
  });
}
