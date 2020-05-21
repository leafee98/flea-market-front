<template>
<div>
  <input type="text" v-model="username" placeholder="input your username"/>
  <br />
  <input type="password" v-model="password" placeholder="input your password"/>
  <br />
  <button @click="register">register</button>
</div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  name: 'RegisterField',
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    register: function () {
      const param = flea.util.cloneObj(flea.api.param.user.register)
      param.username = this.username
      param.password = this.password
      console.log(param)
      flea.api.request(flea.api.url.user.register, param)
        .then(res => res.json()).then(body => console.log(body))
    }
  }
}
</script>
