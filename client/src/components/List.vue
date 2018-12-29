<template>
  <div id="outPut" class="fullsize elevation-10">
    <div v-if="settings.listType === 'ul'">
      <ul>
        <li v-for="item in content" :key="item">{{item}}</li>
      </ul>
    </div>
    <div v-if="settings.listType === 'ol'">
      <ol>
        <li v-for="item in content" :key="item">{{item}}</li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  props: ["content", "settings", "reference"],
  methods: {
    getProperties: function() {
      return {
        props: ["content", "id"],
        template: `<div> 
                    <input v-for="(str, key) in content" :key="str" :v-model="content[key]"></input>
                    <v-btn @click="content.push('')">+</v-btn> 
                    <v-btn @click="$emit('updateComponent', {id: id, content: content})">Save</v-btn>
                  </div>`
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

.fullsize li {
  font-size: 20px;
  font-family: monospace;
}
</style>