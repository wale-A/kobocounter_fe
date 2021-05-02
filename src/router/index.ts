import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Landing from "../views/Landing.vue";
import { AccountRoutes } from "./account";
import Dashboard from "../views/Dashboard.vue";
import PageNotFound from "../views/PageNotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Landing,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  ...AccountRoutes,
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/:pathMach(.*)*",
    name: "NotFound",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
