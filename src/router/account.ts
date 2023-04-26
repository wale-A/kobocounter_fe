import Manage from "@/views/accounts/Manage.vue";
import ResetPassword from "@/views/accounts/ResetPassword.vue";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/account/register",
    name: "Register",
    component: () => import("@/views/accounts/Register.vue"),
    meta: {
      layout: "Account",
    },
  },
  {
    path: "/account/login",
    name: "Login",
    component: () => import("@/views/accounts/Login.vue"),
    meta: {
      layout: "Account",
    },
  },
  {
    path: "/account/add",
    name: "AddAccount",
    component: () => import("@/components/home/AddAccount.vue"),
    meta: {
      layout: "Account",
    },
  },
  {
    path: "/account/manage",
    name: "Manage",
    component: Manage,
    meta: {
      authorize: true,
      layout: "Account",
    },
  },
  {
    // /reset-password?token=YnJvbnNlbi50cmV2b25AaWx5ZGVlbi5vcmc6ODVmMTFhYjk=
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
    meta: {
      layout: "Account",
    },
  },
];

export const AccountRoutes = routes;
