<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search="search"
        sort-by="nombre"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Usuario</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <!--dialogo agregar / editar -->
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
                          :items="selectTipoD"
                          v-model="tipo_documento"
                          label="Tipo de documento"
                        ></v-select>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="num_documento" label="N° de documento"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="apellido_paterno" label="Apellido Paterno"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="apellido_materno" label="Apellido Materno"></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="6" sm="6">
                        <v-select :items="selectRol" v-model="rol" label="Rol"></v-select>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="telefono" label="telefono"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="email" :rules="emailRules" label="correo"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="password"
                          :append-icon="show1 ? 'remove_red_eye' : 'remove_red_eye'"
                          :rules="rulesPassword"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          label="Contraseña"
                          hint="Minimo 7 characteres"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
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
            <!--dialogo activar / desactivar -->
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
        <template v-slot:item.acciones="{ item }">
          <v-icon class="mr-2" @click="editItem(item)">edit</v-icon>
          <v-btn
            class="ma-2"
            tile
            @click="activarDesactiva(item.estado,item)"
            :color="getEstadoC(item.estado)"
            dark
          >
            <v-icon class="ma-2" tile @click="deleteItem(item)">thumbs_up_down</v-icon>
            {{getEstado(item.estado)}}
          </v-btn>
        </template>
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
      //---
      dialog: false,
      search: "",
      usuarios: [],
      selectRol: ["admin", "tecnico", "cliente"],
      selectTipoD: ["DNI", "Carnet Estranjeria"],
      headers: [
        { text: "acciones - estado", value: "acciones" },
        { text: "nombre", value: "nombre" },
        { text: "apellido Paterno", value: "apellido_paterno" },
        { text: "apellido Materno", value: "apellido_materno" },
        { text: "rol", value: "rol" },
        { text: "documento", value: "tipo_documento" },
        { text: "N° documento", value: "num_documento" },
        { text: "telefono", value: "telefono" },
        { text: "email", value: "email" },
      ],
      //contraseña validar
      show1: false,
      rulesPassword: [
        (v) => !!v || "Es requerido",
        (v) => v.length <= 30 || "debe ser menos de 30 digitos",
      ],
      emailRules: [
        (v) => !!v || "E-mail es requerido",
        (v) => /.+@.+/.test(v) || "E-mail debe ser valido",
      ],
      editedIndex: -1,
      _id: "",
      tipo_documento: "",
      num_documento: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      telefono: "",
      email: "",
      rol: "",
      password: "",
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
        .get("usuario/list", configuracion)
        .then(function (response) {
          me.usuarios = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.tipo_documento) {
        this.validaMensaje.push("Seleccione tipo de documento");
      }
      if (this.num_documento.length < 1 || this.num_documento.length > 15) {
        this.validaMensaje.push(
          "El numero de documento debe tener entre 1-15 caracteres"
        );
      }
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre de la usuario debe tener entre 1-50 caracteres"
        );
      }
      if (
        this.apellido_paterno.length < 1 ||
        this.apellido_paterno.length > 50
      ) {
        this.validaMensaje.push(
          "El apellido paterno debe tener entre 1-50 caracteres"
        );
      }
      if (
        this.apellido_materno.length < 1 ||
        this.apellido_materno.length > 50
      ) {
        this.validaMensaje.push(
          "El apellido materno de la usuario debe tener entre 1-50 caracteres"
        );
      }
      if (!this.rol) {
        this.validaMensaje.push("Seleccione rol");
      }
      if (this.password.length < 1 || this.password.length > 50) {
        this.validaMensaje.push("Ingrese contraseña");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    editItem(item) {
      this.limpiar();
      this._id = item._id;
      this.nombre = item.nombre;
      this.apellido_materno = item.apellido_materno;
      this.apellido_paterno = item.apellido_paterno;
      this.num_documento = item.num_documento;
      this.tipo_documento = item.tipo_documento;
      this.telefono = item.telefono;
      this.email = item.email;
      this.rol = item.rol;
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
        .put(
          "usuario/activate",
          {
            _id: this.adId,
          },
          configuracion
        )
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
        .put(
          "usuario/desactivate",
          {
            _id: this.adId,
          },
          configuracion
        )
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
      this.apellido_paterno = "";
      this.apellido_materno = "";
      this.tipo_documento = "";
      this.telefono = "";
      this.email = "";
      this.password = "";
      this.rol = "";
      this.num_documento = "";
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
          .put(
            "usuario/update",
            {
              _id: this._id,
              nombre: this.nombre,
              apellido_paterno: this.apellido_paterno,
              apellido_materno: this.apellido_materno,
              tipo_documento: this.tipo_documento,
              telefono: this.telefono,
              email: this.email,
              password: this.password,
              rol: this.rol,
              num_documento: this.num_documento,
            },
            configuracion
          )
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
          .post(
            "usuario/add",
            {
              nombre: this.nombre,
              apellido_paterno: this.apellido_paterno,
              apellido_materno: this.apellido_materno,
              tipo_documento: this.tipo_documento,
              telefono: this.telefono,
              email: this.email,
              password: this.password,
              rol: this.rol,
              num_documento: this.num_documento,
            },
            configuracion
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
            me.validaMensaje.push("Error ");
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