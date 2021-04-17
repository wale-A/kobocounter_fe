import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/account/register",
    name: "Register",
    component: () => import("@/views/accounts/Register.vue"),
  },
  {
    path: "/account/login",
    name: "Login",
    component: () => import("@/views/accounts/Login.vue"),
  },
  {
    path: "/account/add",
    name: "AddAccount",
    component: () => import("@/components/home/AddAccount.vue"),
  },
];

export const AccountRoutes = routes;
