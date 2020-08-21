<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="ticket"
        :search="search"
        sort-by="usuario"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <!-- titulo -->
            <v-toolbar-title>Mis Tickets</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>   
          </v-toolbar>
        </template>
        <!--listar tabla -->
        <template v-slot:item.acciones="{ item }">  
        </template>
        <!-- si no se encuentra ningun dato -->
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return { 
      dialog: false,
      search:  this.$store.state.usuario.email,
      ticket: [],   
      headers: [ 
        { text: "usuario", value: "usuario.email" },
        { text: "sede", value: "asigUsuario.sede" },
        { text: "Tipo Ticket", value: "tipoticket.nombre" },
        { text: "equipo", value: "equipo.tipo" },
        { text: "descripcion", value: "descripcion" },
        { text: "hora", value: "hora" },
        { text: "anyDesk", value: "anyDesk" },
        { text: "teamViewer", value: "teamViewer" },
        { text: "teamViewerClave", value: "teamViewerClave" }, 
        { text: "creado", value: "createAt" }, 
      ], 
    };
  },  
  created() {  
    this.listar();   
  },

  methods: { 
     
    listar() {
      let me = this;
      axios
        .get("ticket/list")
        .then(function (response) {
          me.ticket = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    } 
  },
};
</script>