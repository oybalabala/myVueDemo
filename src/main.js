import Vue from 'vue'
import App from './App'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import './assets/js/Mock'
// import './utils/flexible.js'
Vue.use(ElementUI)
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
