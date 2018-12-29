<template>
  <div class="fullsize">
    <youtube class="fullsize" :video-id="content" ref="youtube" @playing="playing"></youtube>
  </div>
</template>
<script>
export default {
  props: ["content", "settings", "reference"],
  methods: {
    playVideo() {
      this.player.playVideo();
    },
    playing() {
      console.log("o/ we are watching!!!");
    },
    getProperties: function() {
      return {
        props: ["content", "id"],
        template: `<div> <input v-model="content" @keyup="$emit('updateComponent', {id: id, content: content})"></input> </div>`
      };
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
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