import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import { useAuthStore } from "../stores/auth";

import authroutes from "./auth";
import noteroutes from "./notes";

const routes = [
  {
    path: "/",
    name: "main-home-view",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("../pages/home/Home.vue"),
      },
    ],
  },
  ...authroutes,
  ...noteroutes,
];

const router = createRouter({
  history: createWebHistory("#"),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta?.required_auth && !useAuthStore().authenticated) {
    console.log(to.meta);
    next({ name: "login" });
    return;
  }
  next();
});

export default router;
