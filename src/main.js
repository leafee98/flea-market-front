import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/fleaRouter.js'
import index from './index.vue'
import compoProductDetailTable from '@/components/ProductDetailTable'
import compoProductList from '@/components/ProductList'

Vue.use(Element)

Vue.component('compo-product-detail-table', compoProductDetailTable)
Vue.component('compo-product-list', compoProductList)

new Vue({
  router,
  render: h => h(index)
}).$mount('#app')
