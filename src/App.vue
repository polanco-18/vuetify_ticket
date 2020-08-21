<template>
  <v-app id="app">
    <!-- aca dentro va el codigo html -->
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp"  v-if="logueado" app>
      <v-list dense>
        <template>
          <v-list-item>
            <v-list-item-action>
              <v-icon>person</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{this.$store.state.usuario.email}}</v-list-item-title>
          </v-list-item>
        </template>  
        <template>
          <v-list-item :to="{name:'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>Inicio</v-list-item-title>
          </v-list-item>
        </template>  
        <template v-if="esAdministrador">
          <v-list-item :to="{name:'sede'}">
            <v-list-item-action>
              <v-icon>home_work</v-icon>
            </v-list-item-action>
            <v-list-item-title>Sede</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador">
          <v-list-item :to="{name:'equipo'}">
            <v-list-item-action>
              <v-icon>people</v-icon>
            </v-list-item-action>
            <v-list-item-title>Equipo</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador">
          <v-list-item :to="{name:'tipoticket'}">
            <v-list-item-action>
              <v-icon>confirmation_number</v-icon>
            </v-list-item-action>
            <v-list-item-title>TipoTicket</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador">
          <v-list-item :to="{name:'servicio'}">
            <v-list-item-action>
              <v-icon>design_services</v-icon>
            </v-list-item-action>
            <v-list-item-title>Servicio</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador">
          <v-list-item :to="{name:'usuario'}">
            <v-list-item-action>
              <v-icon>person</v-icon>
            </v-list-item-action>
            <v-list-item-title>Usuarios</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esCliente">
          <v-list-item :to="{name:'AsigTicketC'}">
            <v-list-item-action>
              <v-icon>addchart</v-icon>
            </v-list-item-action>
            <v-list-item-title>Mis Tickets</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador || esTecnico">
          <v-list-item :to="{name:'AsigTicket'}">
            <v-list-item-action>
              <v-icon>desktop_mac</v-icon>
            </v-list-item-action>
            <v-list-item-title>Tickets</v-list-item-title>
          </v-list-item>
        </template> 

      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down font-weight-black"> | Konecta </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn  @click="salir()" icon v-if="logueado">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <!--footer-->

   <v-footer color="secondary">
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }} <strong  class="white--text" > | Konecta</strong></div>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script> 
export default {
  name: "App",
  data() {
    return {
      drawer: true, 
    };
  },
  computed: {
    logueado(){  
      return this.$store.state.usuario;    
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol=='admin';
    }, 
    esCliente(){
      return this.$store.state.usuario && this.$store.state.usuario.rol=='cliente';
    }, 
    esTecnico(){
      return this.$store.state.usuario && this.$store.state.usuario.rol=='tecnico';
    }
  },
  created() {
    this.$store.dispatch('autoLogin');
  },
  methods: {
      salir(){
      this.$store.dispatch("salir");
    }
  }
};
</script>
