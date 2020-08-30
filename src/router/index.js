import Vue from 'vue'
import VueRouter from 'vue-router'
import about from '../components/about'
import query from '../components/query'
import result from '../components/result'
import detail from '../components/detail'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/about',
      component: about
    },
    {
      path: '/query',
      component: query,
      children: [
        {
          path: '/query/result',
          component: result
        },
        {
          path: '/query/detail',
          component: detail
        }
      ]
    }
  ]
})
