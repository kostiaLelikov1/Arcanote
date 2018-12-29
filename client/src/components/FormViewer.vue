<template>
<div>
  <div class="reset-height">
    <v-alert
      v-model="alert"
      dismissible
      type="success"
    >
      Logined successfully!
    </v-alert>
  </div>
  <grid-layout class="elevation-20" :layout.sync="layout" :col-num="12" :row-height="30" :is-draggable="true" :is-resizable="true"
    :is-mirrored="false" :vertical-compact="true" :margin="[40, 40]" :use-css-transforms="true" v-if="layout.length !== 0">

    <grid-item v-for="item in layout" :key="item.i"
                                      :x="item.x" 
                                      :y="item.y" 
                                      :w="item.w" 
                                      :h="item.h"
                                      :minW="item.winW"
                                      :i="item.i"
                                      drag-allow-from=".vue-draggable-handle"
                                      drag-ignore-from=".no-drag">
          <div class="vue-draggable-handle" style="height:10px; width:10px;"><v-icon name="arrows-alt"></v-icon></div>
        <div class="no-drag"></div>          
      <component :is="item.type" :content="item.content" :settings="item.settings" :ref="item.i">
        
      </component>
      
      <v-btn @click="pushProperties(item.i, item.content)" style="height:10px"><v-icon name="star"></v-icon></v-btn>
      
    </grid-item>
  </grid-layout>
</div>
</template>


<script>
import VueGridLayout from "vue-grid-layout";
import Title from "./Title";
import Button from "./Button";
import Image from "./Image";
import Text from "./Text";
import List from "./List";
import Video from "./Video";

export default {
  components: {
    "grid-layout": VueGridLayout.GridLayout,
    "grid-item": VueGridLayout.GridItem,
    "el-title": Title,
    "el-button": Button,
    "el-image": Image,
    "el-text": Text,
    "el-list": List,
    "el-video": Video
  },
  data: function() {
    return {
      minim: 0,
      form: null,
      layout: [
        {
          i: "1",
          x: 0,
          y: 0,
          w: 4,
          h: 4,
          type: "el-title",
          content: "Hello world",
          reference: null,
          settings: {
            color: "#ccccff"
          }
        },
        {
          i: "2",
          x: 4,
          y: 0,
          w: 4,
          h: 2,
          type: "el-button",
          content: "Кнопка",
          reference: null,
          settings: {
            color: "#ccccff"
          }
        },
        {
          i: "3",
          x: 8,
          y: 0,
          w: 4,
          h: 2,
          type: "el-image",
          content: "https://i.gifer.com/7Uz.gif",
          reference: null,
          settings: {
            color: "#fff"
          }
        },
        {
          i: "4",
          x: 8,
          y: 0,
          w: 4,
          h: 2,
          type: "el-text",
          content: "Test",
          reference: null,
          settings: {
            color: "#fff"
          }
        },
        {
          i: "5",
          x: 8,
          y: 0,
          w: 4,
          h: ["lorem", "ipsum", "dolor", "sit", "amet"].length - 1,

          type: "el-list",
          content: ["lorem", "ipsum", "dolor", "sit", "amet"],

          reference: null,
          settings: {
            color: "#fff",
            listType: "ul"
          }
        }
        // {
        //   i: "6",
        //   x: 0,
        //   y: 7,
        //   w: 12,
        //   h: 10,
        //   type: "VID",
        //   content: "dQw4w9WgXcQ",
        //   reference: null,
        //   settings: {
        //     color: "#fff"
        //   }
        // }
      ]
    };
  },
  methods: {
    appendElement: function(event) {
      let maxX = 0,
        maxY = 0,
        id = 0;
      this.layout.forEach(element => {
        maxX < element.x ? (maxX = element.x) : (maxX = maxX);
        maxY < element.y ? (maxY = element.y) : (maxY = maxY);
        id === element.i ? id++ : id;
      });
      let data = {
        i: id,
        x: maxX,
        y: maxY,
        w: 4,
        h: 2,
        type: event,
        content: (function() {
          switch (event) {
            case "el-title": {
              return "Default";
            }
            case "el-text": {
              return "";
            }
            case "el-image": {
              return "https://st.depositphotos.com/1752627/2306/i/450/depositphotos_23061294-stock-photo-hearts-drawn-on-the-sand.jpg";
            }
            case "el-video": {
              return "dQw4w9WgXcQ";
            }
            case "el-list": {
              return ["lorem", "ipsum", "dolor", "sit", "amet"];
            }
            case "el-button": {
              return "Button";
            }
          }
        })(),
        reference: null,
        settings: {
          color: "#fff"
        }
      };
      this.layout.push(data);
    },
    pushProperties: function(id, content) {
      this.$emit("pushPreferences", {
        component: this.$refs[id][0].getProperties(),
        id,
        content
      });
    },
    updateData(id, content) {
      this.layout.forEach(element => {
        if (element.i === id) {
          element.content = content;
        }
      });
    }
  },

  mounted() {}
};
</script>


<style>
</style>

