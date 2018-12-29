<template>
  <div class="fullsize">
    <textarea class="fullsize elevation-10" placeholder="Input text" style="resize: none;" cols="30" rows="10"></textarea>
  </div>
</template>

<script>
export default {
  props: ["content", "settings", "reference"]
};
</script>

<style>
.fullsize {
  width: 100% !important;
  height: 100% !important;
}

.fullsize textarea {
  font-size: 20px;
  font-family: monospace;
}
</style>