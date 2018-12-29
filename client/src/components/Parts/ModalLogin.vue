<template>
    <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>  
        <v-card-title>
          <span class="headline"></span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              
              <v-flex xs12>
                <v-text-field label="Login*" v-model="username" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" type="password" v-model="password" required></v-text-field>
              </v-flex>   
                
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="$emit('closeLogDialog')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="loginUser()">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data: function() {
    return {
      dialog: true,
      username: "",
      password: ""
    };
  },
  methods: {
    loginUser: async function() {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      const formData = new FormData();
      formData.append("username", this.username);
      formData.append("password", this.password);
      try {
        const res = await axios.post(
          "http://localhost:3000/api/v1/auth/login",
          formData,
          config
        );
        this.$store.commit("setToken", res.data.token);
        this.dialog = false;
        this.alert = true;
      } catch (e) {
        console.log(e.message);
        //@todo notif
      }
    }
  }
};
</script>
