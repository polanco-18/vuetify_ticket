<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="sedes"
        :search="search"
        sort-by="nombre"
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
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="pais" label="pais"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" v-show="valida">
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
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
            <!--el formulario que es para activar / desactivar -->
            <v-dialog v-model="adModal" max-width="300px">
              <v-card>
                <v-card-title>
                  <span class="headline" v-if="adAccion==0">Activar Item</span>
                  <span class="headline" v-if="adAccion==1">Desactivar Item</span>
                </v-card-title>

                <v-card-text>
                  Estás a punto de
                  <span v-if="adAccion==0">Activar</span>
                  <span v-if="adAccion==1">Desactivar</span>
                  el item {{adNombre}}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="activarDesactivaCerrar">Cancelar</v-btn>
                  <v-btn color="blue darken-1" v-if="adAccion==0" text @click="activar">Activar</v-btn>
                  <v-btn
                    color="blue darken-1"
                    v-if="adAccion==1"
                    text
                    @click="desactivar"
                  >Desactivar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!--listar tabla -->
        <template v-slot:item.acciones="{ item }">
          <v-icon class="mr-2" @click="editItem(item)">edit</v-icon>

          <v-btn
             class="ma-2" tile 
            @click="activarDesactiva(item.estado,item)"
            :color="getEstadoC(item.estado)"
            dark
          >
            <v-icon 
             class="ma-2" tile @click="deleteItem(item)">thumbs_up_down</v-icon>
            {{getEstado(item.estado)}}
          </v-btn>
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
      sedes: [],
      headers: [
        { text: "acciones - estado", value: "acciones" },
        //{ text: "estado ", value: "estado" },
        { text: "nombre", value: "nombre" },
        { text: "pais", value: "pais" },
      ],
      editedIndex: -1,
      _id: "",
      nombre: "",
      pais: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
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

  methods: {
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("sede/list",configuracion)
        .then(function (response) {
          me.sedes = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre de la sede debe tener entre 1-50 caracteres"
        );
      }
      if (this.pais.length < 1 || this.pais.length > 50) {
        this.validaMensaje.push(
          "La pais de la sede debe tener entre 1-50 caracteres"
        );
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },

    editItem(item) {
      this._id = item._id;
      this.nombre = item.nombre;
      this.pais = item.pais;
      this.dialog = true;
      this.editedIndex = 1;
    },

    activarDesactiva(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre;
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
    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      //editar
      axios
        .put("sede/activate", {
          _id: this.adId,
        },configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      //editar
      axios
        .put("sede/desactivate", {
          _id: this.adId,
        },configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
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
      this.nombre = "";
      this.pais = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        return;
      }
      if (this.editedIndex > -1) {
        //editar
        axios
          .put("sede/update", {
            _id: this._id,
            nombre: this.nombre,
            pais: this.pais,
          },configuracion)
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
        axios
          .post("sede/add", {
            nombre: this.nombre,
            pais: this.pais,
          },configuracion)
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