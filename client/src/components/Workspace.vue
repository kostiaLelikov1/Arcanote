<template>
<div>
  <tool-bar>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs2>
          <v-card-text class="px-0">3</v-card-text>
        </v-flex>
        <v-flex xs7>
          <v-card-text class="px-0">
            <form-view @pushPreferences="mountPreferences($event)" ref="FormView"></form-view>
          </v-card-text>
        </v-flex>
        <v-flex xs3>
          <v-layout column>
            <v-flex xs6>
              <element-picker style="margin-left: 10px" @addEl="appendElement($event)"></element-picker>
            </v-flex>
            <v-flex xs6 style="margin-left: 10px">
              <preferences v-if="preferences" :id="id" :content="content" @updateComponent="$refs.FormView.updateData($event.id, $event.content)"></preferences>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </tool-bar>

</div>
</template>

<script>
import toolBar from "./Parts/ToolBar";
import FormView from "./FormViewer";
import ElementPicker from "./ElementPicker";
import Vue from "vue";

export default {
  beforeCreate() {
    if (this.$store.state.token) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.$store.state.token;
    }
  },
  data: function() {
    return {
      preferences: false,
      id: "",
      content: null
    };
  },
  components: {
    "tool-bar": toolBar,
    "form-view": FormView,
    "element-picker": ElementPicker
  },
  methods: {
    appendElement: function(event) {
      this.$refs.FormView.appendElement(event);
    },
    mountPreferences(event) {
      this.preferences = false;
      this.id = event.id;
      this.content = event.content;
      Vue.component("preferences", event.component);
      this.preferences = true;
    },
    ConsoleLog: function(event) {
      console.log(event);
    }
  },
  mounted() {}
};
</script>
