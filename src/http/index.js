// 导入所有接口
import api from "./implement";

const install = Vue => {
  if (install.installed) return;

  install.installed = true;

  Object.defineProperties(Vue.prototype, {
    $api: {
      get() {
        return api;
      }
    }
  });
};

export default install;
