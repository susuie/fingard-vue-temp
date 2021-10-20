import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { toPath: "", perms: {}, searchData: {} },
  mutations: {
    changePath(state, path) {
      state.toPath = path;
    },
    setPerms(state, perm) {
      state.perms = perm;
    },
    changeSearchData(state, searchData) {
      state.searchData = searchData;
    }
  },
  actions: {},
  modules: {}
});
