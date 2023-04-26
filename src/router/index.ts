import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "../store/index";
import Budgets from "../views/Budgets.vue";
import Dashboard from "../views/Dashboard.vue";
import Insights from "../views/Insights.vue";
import InviteFriends from "../views/InviteFriends.vue";
import Landing from "../views/Landing.vue";
import PageNotFound from "../views/PageNotFound.vue";
import Settings from "../views/Settings.vue";
import Transactions from "../views/Transactions.vue";
import VerifyAccount from "../views/VerifyAccount.vue";
import { AccountRoutes } from "./account";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Landing,
    meta: {
      layout: "Default",
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      layout: "Default",
    },
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
    path: "/invite-friends",
    name: "InviteFriends",
    component: InviteFriends,
    meta: {
      authorize: true,
      layout: "App",
    },
  },
  {
    path: "/insights",
    name: "Insights",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/layout/Route.vue"),
    meta: {
      authorize: true,
      layout: "App",
    },
    children: [
      {
        path: "",
        name: "InsightList",
        component: Insights,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
      {
        path: "/insights/:id",
        name: "InsightDetail",
        component: Insights,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
    ],
  },
  {
    path: "/budgets",
    name: "Budgets",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/layout/Route.vue"),
    meta: {
      authorize: true,
      layout: "App",
    },
    children: [
      {
        path: "",
        name: "BudgetList",
        component: Budgets,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
      {
        path: "/budgets/:id",
        name: "BudgetDetail",
        component: Budgets,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
    ],
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/layout/Route.vue"),
    meta: {
      authorize: true,
      layout: "App",
    },
    children: [
      {
        path: "",
        name: "TransactionList",
        component: Transactions,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
      {
        path: "/transactions/:id/:action",
        name: "TransactionDetail",
        component: Transactions,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/layout/Route.vue"),
    meta: {
      authorize: true,
      layout: "App",
    },
    children: [
      {
        path: "",
        name: "AllSettings",
        component: Settings,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
      {
        path: "/settings/edit-profile",
        name: "EditProfile",
        component: Settings,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
      {
        path: "/settings/manage-accounts",
        name: "ManageAccounts",
        component: Settings,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
      {
        path: "/settings/upgrade-plan",
        name: "UpgradePlan",
        component: Settings,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
      {
        path: "/settings/change-password",
        name: "UpdatePassword",
        component: Settings,
        meta: {
          authorize: true,
          layout: "App",
        },
      },
    ],
  },
  {
    // /verify-email?token=YnJvbnNlbi50cmV2b25AaWx5ZGVlbi5vcmc6ODVmMTFhYjk=
    path: "/verify-email",
    name: "VerifyAccount",
    component: VerifyAccount,
  },
  {
    path: "/:pathMach(.*)*",
    name: "NotFound",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
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
