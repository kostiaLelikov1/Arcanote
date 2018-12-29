<template>
 <div>
  <top-bar></top-bar>
  <template>
  <v-carousel
  elimiter-icon="stop"
    prev-icon="mdi-arrow-left"
    next-icon="mdi-arrow-right">
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      :src="item.src"
    ></v-carousel-item>
  </v-carousel>
</template>
  <v-btn color="primary" dark to="/work">Workspace</v-btn>
  <v-btn color="primary" dark to="/form">Form View</v-btn>
  <div class="mainpg"> 

  </div>
</div>
</template>

<script>
import TopBar from "./Parts/TopBar";
import Reg from "./Parts/ModalReg";

export default {
  name: "MainPage",
  components: {
    "top-bar": TopBar,
    "modal-reg": Reg
  },
  data() {
    return {
      items: [
        {
          i: " ",
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"
        },
        {
          i: " ",
          src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg"
        }
      ]
    };
  }
};
</script>

<style>
#2 {
  text-align: center;
}
</style>


