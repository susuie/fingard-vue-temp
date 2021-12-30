let r = require.context("./", false, /\.vue/);
let routers = r.keys().map(path => {
  let name = path.split("/")[1].split(".")[0];
  let route = {
    path: `/demo/${name}`,
    name: name,
    component: () => import(`${path}`)
  };
  return route;
});
export default routers;
