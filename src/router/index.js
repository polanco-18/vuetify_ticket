import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Sede from '../components/Sede.vue'
import Login from '../components/Login.vue'
import Usuario from '../components/Usuario.vue'

Vue.use(VueRouter)
//se agregan las rutas para las vistas amigables, declaran su ruta de su crud
var router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes : [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta:{
      administrador: true 
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      libre: true
    }
  },
  {
    path: '/sede',
    name: 'sede',
    component: Sede,
    meta:{
      administrador: true 
    }
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: Usuario,
    meta:{
      administrador: true 
    }
  }
]

});
router.beforeEach((to,from,next)=>{
  if(to.matched.some(record=>record.meta.libre)){
    next();
  } else if(store.state.usuario && store.state.usuario.rol =='admin'){
    if(to.matched.some(record=>record.meta.administrador)){
        next();
    } 
  }else{
    next({name : 'login'});
  }
});

export default router
