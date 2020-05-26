import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/pages/login/Login.vue'
import Register from '@/pages/register/Register.vue'

import Profile from '@/pages/profile/Profile'

import ProductSelling from '@/pages/product/list/selling.vue'
import MyProducts from '@/pages/product/list/myProducts.vue'
import BoughtProducts from '@/pages/product/list/boughtProducts.vue'
import CensoringProduct from '@/pages/product/list/censoringProduct'

import ProductDetail from '@/pages/product/detail.vue'
import ProductDetailEdit from '@/pages/product/edit.vue'

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: { name: 'login' } },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/profile', name: 'profile', component: Profile },

  { path: '/product/', redirect: { name: 'productSelling' } },
  { path: '/product/list/selling', name: 'productSelling', component: ProductSelling },
  { path: '/product/list/myProducts', name: 'myProducts', component: MyProducts },
  { path: '/product/list/boughtProducts', name: 'boughtProducts', component: BoughtProducts },
  { path: '/product/list/censoringProduct', name: 'censoringProduct', component: CensoringProduct },

  { path: '/product/detail/:productId', name: 'productDetail', component: ProductDetail },
  { path: '/product/edit/:productId', name: 'productDetailEdit', component: ProductDetailEdit }
]

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

export default router
