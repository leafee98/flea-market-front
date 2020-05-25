<template>
  <div>
    <el-input v-model="username" placeholder="input your username" type="text" />
    <br />
    <el-input v-model="password" placeholder="input your password" type="password" />
    <br />
    <el-button type="primary" @click="login">login</el-button>
    <el-button type="" @click="jmpRegister">go to register</el-button>
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  name: 'Login',
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      const param = flea.api.param.user.authorize
      param.username = this.username
      param.password = this.password
      flea.api.request(flea.api.url.user.authorize, param)
        .then(res => res.json()).then(body => this.handleLogin(body))
    },
    handleLogin: function (body) {
      if (body.success === true) {
        flea.util.cookie.set('token', body.data)
        window.location.reload(false)
      } else {
        flea.util.cookie.set('token', '', 0)
        this.$message({
          message: 'login failed',
          type: 'error'
        })
      }
    },
    jmpRegister: function () {
      this.$router.push({ name: 'register' })
    },
    logged: function () {
      if (flea.util.cookie.get('token') !== undefined) {
        this.$router.push({ name: 'productSelling' })
      }
    }
  },
  created: function () {
    this.logged()
  }
}
</script>
