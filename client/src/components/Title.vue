<template>
  <div class="fullsize">
    <div class="display-3 fullsize elevation-10" :style="styling">{{content}}</div>
  </div>  
</template>

<script>
export default {
  props: ["content", "settings"],
  computed: {
    styling: function() {
      return {
        "background-color": this.settings ? this.settings.color : "#ccccff"
      };
    }
  },
  methods: {
    getProperties: function() {
      return {
        props: ["content", "id"],
        template: `<div>Текст: <input v-model="content" @keyup="$emit('updateComponent', {id: id, content: content})"></input> </div>`
      };
    }
  }
};
</script>

<style>
.fullsize {
  width: 100% !important;
  height: 100% !important;
}
</style>


