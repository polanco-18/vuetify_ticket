<template>
  <v-layout align-center justify-center>
    <v-flex xs="12" sm="8" md="6" lg="5" xl="4">
      <v-card max-width="500" class="mx-auto">
        <v-toolbar dark color="primary">
          <span class="headline">Acceso al sistema</span>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field autofocus label="Email" v-model="email" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  type="password"
                  color="accent"
                  v-model="password"
                  label="Password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-flex class="red--text" v-if="errorM">{{errorM}}</v-flex>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" tile dark color="primary" @click="ingresar()">Ingresar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
      errorM: null,
    };
  },
  methods: {
    ingresar() {
      if (this.email.length < 1 || this.email.length > 200) {
        this.errorM = "Ingrese email";
        return;
      }
      if (this.password.length < 1 || this.password.length > 20) {
        this.errorM = "Ingrese password";
        return;
      }
      axios
        .post("usuario/login", { email: this.email, password: this.password })
        .then((respuesta) => {
          return respuesta.data;
        })
        .then((data) => {
          this.$store.dispatch("guardarToken", data.tokenReturn);
          this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          this.errorM = null;
          if (error.response.status == 404) {
            this.errorM =
              "No existe el usuario o las credenciales son incorrectas";
          } else {
            this.errorM = "Ocurrio un error con el servidor";
          }
        });
    },
  },
};
</script>