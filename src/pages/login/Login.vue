<template>
  <div>
    <input v-model="username" placeholder="input your username" type="text" />
    <hr />
    <input v-model="password" placeholder="input your password" type="password" />
    <hr />
    <button @click="login">login</button>
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
        flea.util.cookie.set('token', body.data, flea.util.cookie.expireSec)
      } else {
        flea.util.cookie.set('token', '', 0)
        alert('login failed!')
      }
    }
  }
}
</script>
