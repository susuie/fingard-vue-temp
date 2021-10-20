const routers = [
  {
    name: "user",
    path: "/user",
    meta: { title: "用户管理", keepAlive: true },
    component: () => import("./user-manage.vue")
  },
  {
    name: "userAdd",
    path: "/user/add",
    component: () => import("./user-add")
  },
  {
    name: "userPerm",
    path: "/user/assign",
    component: () => import("./assign-perm")
  }
];

const user = {};
user.routers = routers;
export default user;
