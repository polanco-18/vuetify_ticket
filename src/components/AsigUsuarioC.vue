<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="asignar"
        :search="search"
        sort-by="usuario"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <!-- titulo -->
            <v-toolbar-title>Mis Servicios</v-toolbar-title>
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
                      <v-col class="d-flex" cols="12" sm="12">
                        <v-select :items="sedes" v-model="sede" label="Seleccione sede"></v-select>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="12">
                        <v-select :items="servicios" v-model="servicio" label="Seleccione servicio"></v-select>
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
          <!--el formulario que sirve para agregar ticket -->
          <v-toolbar flat color="white">
            <v-dialog v-model="dialog2" max-width="700px">
              <v-card>
                <v-card-title>
                  <span class="headline">Crear Ticket</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col class="d-flex" cols="12" sm="12">
                        <v-select
                          :items="tickets"
                          v-model="ticket"
                          label="Seleccione Tipo de ticket"
                        ></v-select>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="12">
                        <v-select :items="equipos" v-model="equipo" label="Seleccione Equipo"></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="descripcion" label="Descripcion" required></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="anyDesk" label="anyDesk" required></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="teamViewer" label="teamViewer" required></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="teamViewerClave" label="teamViewer clave" required></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="ma-2" tile dark color="secondary" @click="close2">Cancelar</v-btn>
                  <v-btn class="ma-2" tile dark color="primary" @click="guardar2">Guardar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!--listar tabla -->
        <template v-slot:item.acciones="{ item }">
          <v-icon class="mr-2" @click="editItem(item)">addchart</v-icon>
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
      dialog2: false,
      tickets: [],
      ticket: "",
      equipos: [],
      equipo: "",
      descripcion: "",
      anyDesk: "",
      teamViewer: "",
      teamViewerClave: "", 
      dialog: false,
      search: this.$store.state.usuario.email,
      asignar: [],
      usuarios: [],
      sedes: [],
      servicios: [],
      headers: [
        { text: "acciones", value: "acciones" },
        { text: "usuario", value: "usuario.email" },
        { text: "sede", value: "sede.nombre" },
        { text: "servicio", value: "servicio.nombre" },
      ],
      editedIndex: -1,
      _id: "",
      usuario: "",
      sede: "",
      servicio: "",
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
    this.selectUsuario();
    this.selectSede();
    this.selectServicio();
    this.selectTickets();
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
    selectTickets() {
      let me = this;
      var tipoticketArray = [];
      axios
        .get("tipoticket/list")
        .then(function (response) {
          tipoticketArray = response.data;
          tipoticketArray.map(function (x) {
            me.tickets.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectUsuario() {
      let me = this;
      var usuarioArray = [];
      axios
        .get("usuario/list")
        .then(function (response) {
          usuarioArray = response.data;
          usuarioArray.map(function (x) {
            me.usuarios.push({
              text:
                x.num_documento +
                " - " +
                x.nombre +
                ", " +
                x.apellido_paterno +
                " " +
                x.apellido_materno,
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
        .get("asigUsuario/listCliente")
        .then(function (response) {
          me.asignar = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.sede) {
        this.validaMensaje.push("Seleccione una sede");
      }
      if (!this.servicio) {
        this.validaMensaje.push("Seleccione una servicio");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    validar2() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.descripcion.length < 1 || this.descripcion.length > 200) {
        this.validaMensaje.push(
          "El nombre de la sede debe tener entre 1-50 caracteres"
        );
      }
      if (this.anyDesk.length < 1 || this.anyDesk.length > 20) {
        this.validaMensaje.push(
          "El nombre de la sede debe tener entre 1-20 caracteres"
        );
      }
      if (this.teamViewer.length < 1 || this.teamViewer.length > 20) {
        this.validaMensaje.push(
          "El nombre de la sede debe tener entre 1-20 caracteres"
        );
      }
      if (this.teamViewerClave.length < 1 || this.teamViewerClave.length > 20) {
        this.validaMensaje.push(
          "El nombre de la sede debe tener entre 1-20 caracteres"
        );
      }
      if (!this.equipo) {
        this.validaMensaje.push("Seleccione un equipo");
      }
      if (!this.ticket) {
        this.validaMensaje.push("Seleccione un tipo ticket");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },

    editItem(item) {
      this._id = item._id;
      this.dialog2 = true;
      this.editedIndex = 1;
    },
    add() {
      this.dialog = true;
      this.editedIndex = 1;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    close2() {
      this.dialog2 = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    limpiar() {
      this._id = "";
      this.sede = "";
      this.servicio = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    limpiar2() {
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
      if (this.validar()) {
        return;
      }
      axios
        .post("asigUsuario/add", {
          usuario: this.$store.state.usuario._id,
          sede: this.sede,
          servicio: this.servicio,
          atencion: "sin atender",
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
    guardar2() {
      let me = this;
      var hora = new Date();
      if (this.validar2()) {
        return;
      }
      axios
        .post("ticket/add", {
          usuario: this.$store.state.usuario._id,
          asigUsuario: this._id,
          tipoticket: this.ticket,
          equipo: this.equipo,
          descripcion: this.descripcion,
          hora:
            hora.getHours() + ":" + hora.getMinutes() + ":" + hora.getSeconds(),
          anyDesk: this.anyDesk,
          teamViewer: this.teamViewer,
          teamViewerClave: this.teamViewerClave,
        })
        .then(function (response) {
          me.limpiar2();
          me.close2();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
      this.close();
    },
    getEstadoC(estado) {
      if (estado == 1) return "green";
      else return "danger";
    },
    getEstado(estado) {
      if (estado == 1) return "Activo";
      else return "Inactivo";
    },
  },
};
</script>