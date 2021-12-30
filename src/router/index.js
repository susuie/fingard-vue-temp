import Vue from "vue";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import index from "@/pages/Index";

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
//重写push方法，统一处理错误捕获
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
    component: () => import(/* webpackChunkName: "about" */ "@/pages/Login.vue")
  },
  {
    path: "*",
    name: "error",
    component: () => import(/* webpackChunkName: "about" */ "@/pages/404")
  }
];
const files = require.context("@/pages", true, /router\.js$/);
let child = files.keys().map(key => {
  const page = require("@/pages" + key.replace(".", ""));
  return page.default;
});
child = child.reduce((all, item) => {
  all.push(...item);
  return all;
}, []);
routes[0].children = child;
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
  if (to.path === "/Login") {
    if (token && token !== "null" && userId) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    if (token === "null" || !token || !userId) {
      next({ path: "/Login" });
    } else {
      next();
    }
  }
});
export default router;
