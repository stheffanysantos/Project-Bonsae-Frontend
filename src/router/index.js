import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/DisciplinasView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history', // ou 'hash' se preferir
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
  ]
})
