import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Sede from '../components/Sede.vue'
import Login from '../components/Login.vue'
import Usuario from '../components/Usuario.vue'
import Servicio from '../components/Servicio.vue'
import Equipo from '../components/Equipo.vue' 
import Tipoticket from '../components/Tipoticket.vue'  
import AsigTicketC from '../components/AsigTicketC.vue'
import AsigTicket from '../components/AsigTicket.vue' 

Vue.use(VueRouter)
//se agregan las rutas para las vistas amigables, declaran su ruta de su crud
var router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        administrador: true,
        tecnico: true,
        cliente: true
      }
    }, 
    {
      path: '/AsigTicket',
      name: 'AsigTicket',
      component: AsigTicket,
      meta: {
        administrador: true,
        tecnico: true
      }
    }, 
    {
      path: '/AsigTicketC',
      name: 'AsigTicketC',
      component: AsigTicketC,
      meta: {
        cliente: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        libre: true
      }
    },
    {
      path: '/sede',
      name: 'sede',
      component: Sede,
      meta: {
        administrador: true
      }
    }, 
    {
      path: '/tipoticket',
      name: 'tipoticket',
      component: Tipoticket,
      meta: {
        administrador: true
      }
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario,
      meta: {
        administrador: true
      }
    },
    {
      path: '/servicio',
      name: 'servicio',
      component: Servicio,
      meta: {
        administrador: true
      }
    },
    {
      path: '/equipo',
      name: 'equipo',
      component: Equipo,
      meta: {
        administrador: true
      }
    }
  ]

})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next();
  } else if (store.state.usuario && store.state.usuario.rol == 'admin') {
    if (to.matched.some(record => record.meta.administrador)) {
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'tecnico') {
    if (to.matched.some(record => record.meta.tecnico)) {
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'cliente') {
    if (to.matched.some(record => record.meta.cliente)) {
      next();
    }
  } else {
    next({ name: 'login' });
  }
})

export default router
