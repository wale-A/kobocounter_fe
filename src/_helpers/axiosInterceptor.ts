import axios from "axios";
import { store } from "@/store";

// handles 401 and 403 responses from the server
// it automatically logs the user out
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

// adds the authorization token to the request header
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
