import axios from "axios";
import { store } from "@/store";

function unauthorizedResponseInterceptor(): void {
  axios.interceptors.response.use(undefined, (error) => {
    const { response } = error;

    if (response) {
      if ([401, 403].includes(response.status)) {
        return store.commit("logoutUser");
      } else {
        return response;
      }
    } else {
      throw new Error();
    }
  });
}

function authHeaderInterceptor() {
  axios.interceptors.request.use((request) => {
    if (store.state.user?.token?.token) {
      request.headers.common.Authorization = `Bearer ${store.state.user?.token?.token}`;
    }

    return request;
  });
}

export default {
  unauthorizedInterceptor: unauthorizedResponseInterceptor,
  authInterceptor: authHeaderInterceptor,
};
