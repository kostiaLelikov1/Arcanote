<template>
  <div class="fullsize outside">
    <v-btn depressed large color="primary" class="fullsize button-component elevation-10" :style="styling" @click="">{{content}}</v-btn>
  </div>  
</template>

<script>
export default {
  props: ["content", "settings", "reference"],
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
        template: `<div> <input v-model="content" @keyup="$emit('updateComponent', {id: id, content: content})"></input> </div>`
      };
    }
  }
};
</script>

<style>
.fullsize {
  margin: 0;
  padding: 0;
  width: 100% !important;
  height: 100% !important;
}

.outside {
  padding: 10px;
}

.button-component {
  border-radius: 20px;
}
</style>
