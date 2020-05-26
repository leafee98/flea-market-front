<template>
  <div id='app'>
    <el-container>
      <el-header>
        <div>
          flea markdet
          <el-button @click="jumpMarket">market</el-button>
          <el-button v-if="admin" @click="jumpCensoringProduct">censoring product</el-button>
          <el-button v-if="logged" @click="jumpMyProducts">my products</el-button>
          <el-button v-if="logged" @click="jumpBoughtProducts">bought products</el-button>
          <el-button v-if="logged" @click="newProduct">publish product</el-button>
          <el-button v-if="logged" @click="jumpProfile">my profile</el-button>
          <el-button type="warning" v-if="logged" @click="logout">logout</el-button>
          <el-avatar v-if="logged" src="avatarUrl">{{ nickname }}</el-avatar>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  data: function () {
    return {
      username: '',
      nickname: '',
      avatarUrl: '',
      admin: false
    }
  },
  computed: {
    logged: function () {
      return this.nickname !== ''
    }
  },
  methods: {
    logout: function () {
      flea.util.cookie.set('token', '23', 0)
      this.$message({
        message: 'logout from flea market, go to login page',
        type: 'warning'
      })
      setTimeout(this.jumpLogin, 500)
    },
    newProduct: function () {
      const param = {
        token: flea.util.cookie.get('token')
      }
      flea.api.request(flea.api.url.product.newProduct, param)
        .then(res => res.json()).then(this.handleNewProduct)
    },
    handleNewProduct: function (body) {
      if (body.success === true) {
        this.jumpProductEdit(body.data)
      } else {
        this.$message({
          message: 'failed to create new product',
          type: 'error'
        })
      }
    },
    jumpBoughtProducts: function () {
      this.$router.push({ name: 'boughtProducts' })
    },
    jumpProfile: function () {
      this.$router.push({ name: 'profile' })
      window.location.reload(false)
    },
    jumpMarket: function () {
      this.$router.push({ name: 'productSelling' })
    },
    jumpCensoringProduct: function () {
      this.$router.push({ name: 'censoringProduct' })
    },
    jumpProductEdit: function (productId) {
      this.$router.push({ name: 'productDetailEdit', params: { productId: productId } })
    },
    jumpLogin: function () {
      this.$router.push({ name: 'login', params: { logout: true } })
    },
    jumpMyProducts: function () {
      this.$router.push({ name: 'myProducts' })
    }
  },
  created: function () {
    const param = { token: flea.util.cookie.get('token') }
    flea.api.request(flea.api.url.user.getMyDetail, param)
      .then(res => res.json()).then(body => {
        if (body.success === true) {
          this.username = body.data.username
          this.nickname = body.data.nickname
          this.avatarUrl = body.data.avatarUrl
          this.admin = body.data.admin
        }
      })
  }
}
</script>

<style>

</style>
