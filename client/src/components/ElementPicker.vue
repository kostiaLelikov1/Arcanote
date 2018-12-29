<template>
  <v-list class="elevation-10">
    <v-list-tile
      v-for="component in existingComponents" 
      :key="component.name"
      @click="$emit('addEl', component.component)"
    >

      <v-list-tile-content>
        <v-list-tile-title v-text="component.name"></v-list-tile-title>
      </v-list-tile-content>

    </v-list-tile>
  </v-list>
</template>

<script>
import Title from "./Title";
import Text from "./Text";
import Image from "./Image";
import Video from "./Video";
import List from "./List";
import Button from "./Button";

export default {
  components: {
    "el-title": Title,
    "el-text": Text,
    "el-image": Image,
    "el-video": Video,
    "el-list": List,
    "el-button": Button
  },
  data: function() {
    return {
      existingComponents: [
        { name: "Title", component: "el-title" },
        { name: "Text", component: "el-text" },
        { name: "Image", component: "el-image" },
        { name: "Video", component: "el-video" },
        { name: "List", component: "el-list" }
      ]
    };
  }
};
</script>
