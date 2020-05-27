import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/fleaRouter.js'
import index from './index.vue'

import compoProductDetailTable from '@/components/ProductDetailTable.vue'
import compoProductList from '@/components/ProductList.vue'
import compoUserSummary from '@/components/UserSummary.vue'
import compoChatPanel from '@/components/ChatPanel.vue'

Vue.use(Element)

Vue.component('compo-product-detail-table', compoProductDetailTable)
Vue.component('compo-product-list', compoProductList)
Vue.component('compo-user-summary', compoUserSummary)
Vue.component('compo-chat-panel', compoChatPanel)

new Vue({
  router,
  render: h => h(index)
}).$mount('#app')
