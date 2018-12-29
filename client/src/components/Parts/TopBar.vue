<template>
<div>
  <v-toolbar>
    <v-btn flat>Home</v-btn>
    
    <v-btn flat >About</v-btn>  
    
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
    

      <v-btn slot="activator" color="primary" flat @click="loginDialog = !loginDialog">Sign In</v-btn>
      <v-btn slot="activator" color="primary" flat @click="registrationDialog = !registrationDialog">Sign Up</v-btn>
        
    </v-toolbar-items>
  </v-toolbar>

  <modal-reg v-if="registrationDialog" @closeRegDialog="closeRegDialog()" ></modal-reg>
  <modal-log v-if="loginDialog" @closeLogDialog="loginDialog = !loginDialog"></modal-log>
</div>

</template>

<script>
import ModalReg from "./ModalReg";
import ModalLog from "./ModalLogin";

export default {
  methods: {
    closeRegDialog: function() {
      console.log("Huuui!");
      this.registrationDialog = !this.registrationDialog;
    }
  },
  components: {
    "modal-reg": ModalReg,
    "modal-log": ModalLog
  },
  data: function() {
    return {
      loginDialog: false,
      registrationDialog: false
    };
  }
};
</script>
