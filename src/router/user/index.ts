import MainLayout from "../../layouts/MainLayout.vue";
const userroutes = [
  {
    path: "/user",
    component: MainLayout,
    meta: {
      required_auth: true,
    },
    children: [
      {
        path: "",
        name: "user-info",
        component: () => import("../../pages/user-profile/index.vue"),
      },
    ],
  },
];

export default userroutes;
