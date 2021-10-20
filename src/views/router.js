import user from "@/views/sys-manage/user-manage";
import home from "@/views/Home";
const views = { routers: [] };
const module = [user];
module.map(item => {
  views.routers = views.routers.concat(item.routers);
});
let route = [
  {
    name: "home",
    path: "/home",
    alias: "",
    component: home,
    meta: {
      keepAlive: true
    }
  }
];
views.routers = views.routers.concat(route);
export default views;
