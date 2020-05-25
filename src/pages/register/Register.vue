<template>
<div>
  <el-row>
    <el-col :span="6">
      <el-input v-model="username" placeholder="input your username"/>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <el-input v-model="nickname" placeholder="input your nickname"/>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <el-input show-password v-model="password" placeholder="input your password"/>
    </el-col>
  </el-row>
  <br />
  <el-row>
    <el-col :span="6">
      <el-button @click="register" type="primary">register</el-button>
      <el-button @click="jmpLogin" type="">go to login</el-button>
    </el-col>
  </el-row>
  <br />
</div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  name: 'RegisterField',
  data: function () {
    return {
      username: '',
      nickname: '',
      password: ''
    }
  },
  methods: {
    register: function () {
      const param = flea.util.cloneObj(flea.api.param.user.register)
      param.username = this.username
      param.password = this.password
      param.nickname = this.nickname
      console.log(param)
      flea.api.request(flea.api.url.user.register, param)
        .then(res => res.json()).then(body => this.handleRegister(body))
    },
    handleRegister: function (body) {
      if (body.success === true) {
        this.$message({
          message: 'register success, jump to login page in 2 seconds',
          type: 'success'
        })

        setTimeout(this.jmpLogin, 2000)
      } else {
        this.$message({
          message: 'register failed for unknown reason',
          type: 'error'
        })
      }
    },
    jmpLogin: function () {
      this.$router.push(
        {
          name: 'login',
          params: { value: 2 }
        })
    }
  }
}
</script>
