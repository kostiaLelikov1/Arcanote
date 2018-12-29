<template>
    <div>
    <tool-bar></tool-bar>
  <img v-viewer src="https://picsum.photos/1440/900/?image=53" alt="">
    </div>
</template>
<script>
import toolBar from "./Parts/ToolBar";

export default {
  components: {
    "tool-bar": toolBar
  }
};
</script>

