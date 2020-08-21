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
            <v-toolbar-title>Sede</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- busqueda -->
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
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
                        <v-select
                          :items="usuarios" 
                          v-model="usuario"
                          label="Seleccione usuario"
                        ></v-select>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="12">
                        <v-select
                          :items="sedes" 
                          v-model="sede"
                          label="Seleccione sede"
                        ></v-select>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="12">
                        <v-select
                          :items="servicios" 
                          v-model="servicio"
                          label="Seleccione servicio"
                        ></v-select>
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
        <!--listar tabla -->
        <template v-slot:item.acciones="{ item }">
          <v-icon class="mr-2" @click="editItem(item)">edit</v-icon>  
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
      search: "",
      asignar: [],
      usuarios: [],
      sedes: [],
      servicios: [],
      headers: [
        { text: "acciones - estado", value: "acciones" }, 
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
  },

  methods: {
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
                x.num_documento + " - " + x.nombre + ", " + x.apellido_paterno + " " + x.apellido_materno+ " - " + x.email,
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
              text:
                x.nombre + " " + x.pais ,
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
              text:
                x.nombre,
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
      if (!this.usuario) {
        this.validaMensaje.push("Seleccione una categoria");
      }
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

    editItem(item) {
      this._id = item._id; 
      this.usuario = item.usuario.email;  
      this.sede = item.sede.nombre;
      this.servicio = item.servicio.nombre;
      this.dialog = true;
      this.editedIndex = 1;
    },

    activarDesactiva(accion, item) {
      this.adModal = 1;
      this.adusuario = item.usuario;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 0) {
        this.adAccion = 0;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivaCerrar() {
      this.adModal = 0;
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
      this.usuario = "";
      this.sede = "";
      this.servicio = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    guardar() {
      let me = this;
      if (this.validar()) {
        return;
      }
      if (this.editedIndex > -1) {
        //editar
        axios
          .put("asigUsuario/update", {
            _id: this._id,
            usuario: this.usuario,
            sede: this.sede,
          })
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //crear
        
            console.log(this.usuario);
            console.log(this.sede);
            console.log(this.servicio);
        axios
          .post("asigUsuario/add", {
            usuario: this.usuario,
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
      }
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