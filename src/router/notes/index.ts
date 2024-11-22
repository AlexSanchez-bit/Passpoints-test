import MainLayout from "../../layouts/MainLayout.vue";
const authroutes = [
  {
    path: "/notes",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "notes",
        component: () => import("../../pages/notes/index.vue"),
      },
    ],
  },
];

export default authroutes;
