import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)
import store from './store/index';

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
