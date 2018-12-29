// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App";
import router from "./router";

import "vuetify/dist/vuetify.min.css";
import "vue-awesome/icons/flag";
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";
import VueYoutube from "vue-youtube";
import store from "./store";

Vue.use(Vuetify);
Vue.use(VueYoutube);
Vue.component("v-icon", Icon);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App, "v-icon": Icon },
  template: "<App/>"
});
