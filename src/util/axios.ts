import axios from "axios";
import store from "../store/index";
import { deleteUser, getUserToken } from "./index";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(undefined, (error) => {
  const { response } = error;
  if (response) {
    if ([401, 403].includes(response.status)) {
      return store.dispatch("logout").then(() => deleteUser());
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
