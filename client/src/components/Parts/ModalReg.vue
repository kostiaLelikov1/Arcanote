<template>
  <div>
    <div class="reset-height">
      <v-alert
        v-model="alert"
        dismissible
        type="success"
      >
        Registered successfully!
      </v-alert>
    </div>
    <v-layout row justify-center> 
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="headline"></span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-text-field label="First name*" :rules="nameRules" v-model="name" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field 
                    :rules="nameRules"
                    label="Last name"
                    v-model="surname"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field :rules="loginRules" label="Login*" v-model="username" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" label="Password*" type="password" v-model="password" required></v-text-field>
                </v-flex>   
                <v-flex xs12>
                  <v-text-field :rules="passwordConfirmRules" label="Repeat password*" type="password" v-model="confirm" required></v-text-field>
                </v-flex>   
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="$emit('closeRegDialog')">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="registerUser()">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-layout>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function() {
    return {
      valid: true,
      alert: false,
      name: "",
      surname: "",
      username: "",
      password: "",
      confirm: "",
      dialog: true,
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 30) || "Name must be less than 30 characters"
      ],
      loginRules: [
        v => !!v || "Login is required",
        v => /[A-Za-z_0-9]{5,20}/.test(v) || "Login must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => (v.length >= 8 && v.length <= 30) || "Password must be valid"
      ],
      passwordConfirmRules: [
        v => !!v || "Confirmation is required",
        v => this.areEqual() || "Paswords don't match"
      ]
    };
  },
  methods: {
    areEqual: function() {
      return this.password === this.confirm;
    },
    registerUser: async function() {
      if (this.$refs.form.validate()) {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        const formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.password);
        formData.append("password2", this.confirm);
        formData.append("name", this.name);
        formData.append("surname", this.surname);
        try {
          const resp = await axios.post(
            "http://localhost:3000/api/v1/users",
            formData,
            config
          );
          console.log(resp);
          if (!resp) throw Error("hmmm");
          this.dialog = false;
          this.alert = true;
        } catch (e) {
          console.log(e.message);
          //@todo notif
        }
      }
    }
  }
};
</script>
<style scoped>
.error--text {
  color: #f23030;
}
.success {
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
  /* width: 100% !important; */
  z-index: 100;
  position: absolute;
  top: 5%;
  left: calc(50% - 354px / 2);
}
.reset-height {
  display: block !important;
  line-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>