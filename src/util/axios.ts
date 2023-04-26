import axios from "axios";
import store from "../store/index";
import { deleteUser, getUserToken } from "./index";

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
    if ([401].includes(response.status)) {
      return store.dispatch("logout").then(() => {
        deleteUser();
        location.href = "/account/login";
      });
    } else if (response.status.toString().startsWith("4")) {
      throw new Error(response.data);
    } else {
      return response;
    }
  } else {
    throw new Error(error);
  }
});

instance.interceptors.request.use((request) => {
  const token = getUserToken();
  if (token) {
    request.headers.common.Authorization = `Bearer ${token}`;
  }

  return request;
});

export default instance;
