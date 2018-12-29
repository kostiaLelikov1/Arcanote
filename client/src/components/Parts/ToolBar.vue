<template>
    <v-app>
        <v-navigation-drawer app temporary v-model="drawer" style="margin-top: 65px">
            <v-list>
            <v-list-tile
              v-for="workspace in workspaces"
              :key="workspace.name"

            >
              <v-list-tile-action v-if="workspace.state === true">
                <div class="favorite">
                    <v-icon name="star" scale="2" color="orange"/>  {{workspace.name}}
                </div>
               
              </v-list-tile-action>
  
              <v-list-tile-action v-if="workspace.state === false">
                <div class="unfavorite">
                    <v-icon name="regular/star" scale="2" color="orange"/>  {{workspace.name}}
                </div>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
        <v-toolbar app dark color="primary">
            <v-toolbar-side-icon @click="drawer =!drawer">
            </v-toolbar-side-icon>
            <v-toolbar-title>Workpage</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat>
                    <v-icon name="user" />
                </v-btn>
                <v-btn flat to="/">
                    <v-icon name="home" />
                </v-btn>
                <v-btn flat>
                    <v-icon name="cog" />
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
          
            <slot></slot>

        </v-content>
        <v-footer app></v-footer>
    </v-app>
</template>
<script>
export default {
  data: function() {
    return {
      drawer: false,
      workspaces: [
        {
          name: "workspace1",
          state: false,
          path: ""
        },
        {
          name: "workspace2",
          state: false,
          path: ""
        },
        {
          name: "workspace3",
          state: true,
          path: ""
        },
        {
          name: "workspace4",
          state: true,
          path: ""
        },
        {
          name: "workspace5",
          state: false,
          path: ""
        }
      ]
    };
  }
};
</script>

<style>
.favorite,
.unfavorite {
  /* display: block; */
  margin-top: 5px;
  margin-left: 5px;
  background: transparent;
  border: 0;
  font-size: 30px;
  outline: none;
  /* color: rgba(0, 0, 0, 0.65); */
  cursor: pointer;
  /* border-radius: 50%; */
  transition: all 0.3s ease-in-out;
}
</style>
