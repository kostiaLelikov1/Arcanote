import Vue from "vue";
import Router from "vue-router";
import MainPage from "@/components/MainPage.vue";
import FormViewer from "@/components/FormViewer";
import Workspace from "@/components/Workspace";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "MainPage",
      component: MainPage
    },
    {
      path: "/form",
      name: "Form",
      component: FormViewer
    },
    {
      path: "/work",
      name: "WorkPage",
      component: Workspace
    }
  ]
});
