import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: ""
  },
  mutations: {
    setToken(state, jwt) {
      state.token = jwt;
    },
    removeToken(state) {
      state.token = null;
    }
  }
});
