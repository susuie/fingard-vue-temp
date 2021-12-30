import "core-js/stable";
import "regenerator-runtime/runtime";
import "@/plugins/element-ui.js";
import Vue from "vue";
import router from "./router";
import VueCookies from "vue-cookies";
import component from "./components";
import api from "./http";
import "@assets/fonts/iconfont.css";
import "@assets/styles/basic.less";
import App from "./App.vue";
import store from "./store";
import columns from "@/utils/columns";
import Clipboard from "v-clipboard";
import "@/utils/directive.js";

Vue.config.productionTip = false;
Vue.use(Clipboard);
Vue.use(component);
Vue.use(api);
Vue.use(VueCookies);
Vue.prototype.$columns = columns;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
