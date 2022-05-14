import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Landing from "../views/Landing.vue";
import { AccountRoutes } from "./account";
import Dashboard from "../views/Dashboard.vue";
import Insights from "../views/Insights.vue";
import PageNotFound from "../views/PageNotFound.vue";
import Transactions from "../views/Transactions.vue";
import store from "../store/index";

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
    meta: {
      authorize: true,
      layout: "App",
    },
  },
  {
    path: "/insights",
    name: "Insights",
    component: Insights,
    meta: {
      authorize: true,
      layout: "App",
    },
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: Transactions,
    meta: {
      authorize: true,
      layout: "App",
    },
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

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.authorize)) {
    if (!store.getters.isLoggedIn) {
      next({ name: "Login", params: { nextUrl: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
