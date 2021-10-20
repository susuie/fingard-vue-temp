import Vue from "vue";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import index from "@/views/Index";
import views from "@/views/router";

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
const routes = [
  {
    path: "/",
    name: "index",
    component: index,
    children: []
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import(/* webpackChunkName: "about" */ "@/views/Login.vue")
  },
  {
    path: "*",
    name: "error",
    component: () => import(/* webpackChunkName: "about" */ "@/views/404")
  }
];
routes[0].children = routes[0].children.concat(views.routers);
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let token = VueCookies.get("token");
  let userInfo = localStorage.getItem("userInfo");
  let userId = userInfo ? JSON.parse(userInfo).userId : "";
  //console.log("执行路由(" + to.path + ")前，验证是否已经携带token：token=" + token + " | userId=" + userId)
  if (to.path === "/Login") {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (token && token !== "null" && userId) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    if (token === "null" || !token || !userId) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({ path: "/Login" });
    } else {
      // 进入主页面
      next();
    }
  }
});
export default router;
