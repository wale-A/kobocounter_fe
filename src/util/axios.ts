import axios from "axios";
import { store } from "@/store";

export const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(undefined, (error) => {
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

instance.interceptors.request.use((request) => {
  if (store.state.user?.token?.token) {
    request.headers.common.Authorization = `Bearer ${store.state.user?.token?.token}`;
  }

  return request;
});

export default instance;
