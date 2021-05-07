import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Landing from "../views/Landing.vue";
import { AccountRoutes } from "./account";
import Dashboard from "../views/Dashboard.vue";
import PageNotFound from "../views/PageNotFound.vue";
import { store } from "@/store";

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
      console.log("here in routeee");
      next({ name: "Login", params: { nextUrl: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
