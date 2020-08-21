<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="lista"
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

            <!--el formulario que sirve para agregar / editar -->
            <v-dialog v-model="dialog" max-width="700px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="ma-2" tile dark color="primary" v-bind="attrs" v-on="on">Nuevo</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col class="d-flex" cols="6" sm="6">
                        <v-select
                          :items="tipoTickets"
                          v-model="tipoTicket"
                          label="Seleccione Tipo de ticket"
                        ></v-select>
                      </v-col>
                      <v-col class="d-flex" cols="6" sm="6">
                        <v-select :items="equipos" v-model="equipo" label="Seleccione Equipo"></v-select>
                      </v-col>
                      <v-col class="d-flex" cols="6" sm="6">
                        <v-select :items="sedes" v-model="sede" label="Seleccione sede"></v-select>
                      </v-col>
                      <v-col class="d-flex" cols="6" sm="6">
                        <v-select :items="servicios" v-model="servicio" label="Seleccione servicio"></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="descripcion" label="Descripcion"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" v-show="valida">
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field v-model="anyDesk" label="anyDesk"></v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field v-model="teamViewer" label="teamViewer"></v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field v-model="teamViewerClave" label="teamViewer clave"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="ma-2" tile dark color="secondary" @click="close">Cancelar</v-btn>
                  <v-btn class="ma-2" tile dark color="primary" @click="guardar">Guardar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
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
      //ticket
      lista: [],
      dialog: false,
      sede: "",
      sedes: [],
      servicio: "",
      servicios: [],
      tipoTickets: [],
      tipoTicket: "",
      equipos: [],
      equipo: "",
      descripcion: "",
      anyDesk: "",
      teamViewer: "",
      teamViewerClave: "",
      search: this.$store.state.usuario.email,
      headers: [ 
        { text: "usuario", value: "usuario.email" },
        { text: "sede", value: "sede.nombre" },
        { text: "servicio", value: "servicio.nombre" },
        { text: "tipoticket", value: "tipoticket.nombre" },
        { text: "equipo", value: "equipo.tipo" },
        { text: "descripcion", value: "descripcion" }, 
        { text: "hora", value: "hora" }, 
        { text: "fecha", value: "fecha" }, 
        { text: "anyDesk", value: "anyDesk" }, 
        { text: "teamViewer", value: "teamViewer" }, 
        { text: "teamViewerClave", value: "teamViewerClave" }, 
        { text: "estado", value: "estado" },  
      ],
      editedIndex: -1,
      _id: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adusuario: "",
      adId: "",
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
  },

  created() {
    this.listar();
    this.selectSede();
    this.selectServicio();
    this.selectTipoTicket();
    this.selectEquipo();
  }, 
  methods: {
    selectEquipo() {
      let me = this;
      var equipoArray = [];
      axios
        .get("equipo/list")
        .then(function (response) {
          equipoArray = response.data;
          equipoArray.map(function (x) {
            me.equipos.push({
              text: x.tipo,
              value: x._id,
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectTipoTicket() {
      let me = this;
      var tipoticketArray = [];
      axios
        .get("tipoticket/list")
        .then(function (response) {
          tipoticketArray = response.data;
          tipoticketArray.map(function (x) {
            me.tipoTickets.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectSede() {
      let me = this;
      var sedeArray = [];
      axios
        .get("sede/list")
        .then(function (response) {
          sedeArray = response.data;
          sedeArray.map(function (x) {
            me.sedes.push({
              text: x.nombre + " " + x.pais,
              value: x._id,
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectServicio() {
      let me = this;
      var servicioArray = [];
      axios
        .get("servicio/list")
        .then(function (response) {
          servicioArray = response.data;
          servicioArray.map(function (x) {
            me.servicios.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listar() {
      let me = this;
      axios
        .get("ticket/list")
        .then(function (response) {
          me.lista = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.tipoTicket) {
        this.validaMensaje.push("Seleccione un tipo ticket");
      }
      if (!this.equipo) {
        this.validaMensaje.push("Seleccione un equipo");
      }
      if (!this.sede) {
        this.validaMensaje.push("Seleccione una sede");
      }
      if (!this.servicio) {
        this.validaMensaje.push("Seleccione un servicio");
      }
      if (this.descripcion.length < 1 || this.descripcion.length > 200) {
        this.validaMensaje.push(
          "La descripcion debe tener entre 1-200 caracteres"
        );
      }
      if (this.anyDesk.length < 1 || this.anyDesk.length > 20) {
        this.validaMensaje.push(
          "El anyDesk debe tener entre 1-20 caracteres"
        );
      }
      if (this.teamViewer.length < 1 || this.teamViewer.length > 20) {
        this.validaMensaje.push(
          "El teamViewer debe tener entre 1-20 caracteres"
        );
      }
      if (this.teamViewerClave.length < 1 || this.teamViewerClave.length > 20) {
        this.validaMensaje.push(
          "El teamViewerClave debe tener entre 1-20 caracteres"
        );
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    add() {
      this.dialog = true;
      this.editedIndex = 1;
    },
    close() {
      this.limpiar();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    limpiar() {
      this._id = "";
      this.descripcion = "";
      this.anyDesk = "";
      this.teamViewer = "";
      this.teamViewerClave = "";
      this.equipo = "";
      this.ticket = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    guardar() {
      let me = this;
      var hora = new Date();
      var m = hora.getMonth() + 1;
      var mes = (m < 10) ? '0' + m : m;
      if (this.validar()) {
        return;
      }
      axios
        .post("ticket/add", {
          usuario: this.$store.state.usuario._id,
          tipoticket: this.tipoTicket,
          equipo: this.equipo,
          sede: this.sede,
          servicio: this.servicio,
          descripcion: this.descripcion,
          hora:
            hora.getHours() + ":" + hora.getMinutes() + ":" + hora.getSeconds(),
          fecha:
            hora.getDate() + "/" + mes + "/" + hora.getYear(),
          anyDesk: this.anyDesk,
          teamViewer: this.teamViewer,
          teamViewerClave: this.teamViewerClave,
          estado: "Pendiente",
        })
        .then(function (response) {
          me.limpiar();
          me.close();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
      this.close();
    },
  },
};
</script>