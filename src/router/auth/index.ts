import MainLayout from "../../layouts/MainLayout.vue";
const authroutes = [
  {
    path: "/auth",
    name: "auth",
    component: MainLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("../../pages/auth/login/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("../../pages/auth/register/Register.vue"),
      },
    ],
  },
];

export default authroutes;
