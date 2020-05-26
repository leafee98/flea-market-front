<template>
  <div>
    <div style="display: flex">
      <el-avatar :size="128" style="margin: auto" src="avatarUrl"></el-avatar>
    </div>
    <br />
    <table>
      <tr v-for="item in getIter(userInfo)" :key="item.key">
        <td>{{ item.name }}</td>
        <td>
          <div class="oneline-text-area">
            {{ item.value }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: [
    'seller'
  ],
  data: function () {
    return {
      userInfo: {
        username: '',
        nickname: '',
        banStatus: ''
      },
      avatarUrl: ''
    }
  },
  computed: {
  },
  watch: {
    seller: function () {
      this.loadInfo()
    }
  },
  methods: {
    loadInfo: function () {
      this.userInfo.username = this.seller.username
      this.userInfo.nickname = this.seller.nickname
      this.avatarUrl = this.seller.avatarUrl
      this.userInfo.banStatus = new Date().getTime() < this.seller.banUntil
    },
    getIter: function (obj) {
      let x = 0
      const res = []
      for (const prop in obj) {
        res.push({ name: prop, value: obj[prop], key: x++ })
      }
      return res
    }
  }
}
</script>

<style>
.oneline-text-area {
  color: #606266;
  width: 220px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
