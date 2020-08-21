<template>
  <v-layout align-center> 
  <div class="mx-auto">
    <h1 class="primary--text">Bienvenido al sistema</h1>
    <h2 class="secondary--text">¡ <strong>{{this.$store.state.usuario.email}}</strong> !</h2>
  </div>
  </v-layout>
</template> 
