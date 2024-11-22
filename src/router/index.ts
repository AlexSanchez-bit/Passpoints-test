import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";

import authroutes from "./auth";
import noteroutes from "./notes";

const routes = [
  {
    path: "/",
    name: "main-home",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "main-home-view",
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

export default router;
