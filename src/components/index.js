let r = require.context("./", false, /\.vue/);
let componentList = r.keys().map(path => {
  let name = path.split("/")[1].split(".")[0];
  name = r(`${path}`).default;
  return name;
});
export default {
  ...componentList,
  install(Vue) {
    componentList.forEach(item => {
      Vue.component(item.name, item);
    });
  }
};
