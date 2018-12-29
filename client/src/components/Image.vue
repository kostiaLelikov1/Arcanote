<template>
  <div class="fullsize">
    <img class="fullsize elevation-10" :src="content" height="42" width="42">
  </div>  
</template>

<script>
export default {
  props: ["content", "settings", "reference"],
  methods: {
    getProperties: function() {
      return {
        props: ["content", "id"],
        template: `<div>Ссылка: <input v-model="content" @keyup="$emit('updateComponent', {id: id, content: content})"></input> </div>`
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


