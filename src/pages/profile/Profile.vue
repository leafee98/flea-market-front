<template>
  <el-container>
    <el-main>
      <div class="item-account">
        <div class="entry">avatar:</div>
        <el-input id="avatarFile" type="file" class="input-small"></el-input>
        <el-button type="primary">update</el-button>
      </div>
      <div class="item-account">
        <div class="entry">username:</div>
        <el-input v-model="username" class="input-small"></el-input>
        <el-button type="primary">save</el-button>
      </div>

      <div class="item-account">
        <div class="entry">password:</div>
        <el-input v-model="password" class="input-small" type="password"></el-input>
        <el-button type="primary">modify</el-button>
      </div>

      <div class="item-account">
        <div class="entry">nickname:</div>
        <el-input v-model="nickname" class="input-small"></el-input>
        <el-button type="primary">save</el-button>
      </div>

      <div class="item-account">
        <div class="entry">ban status:</div>
        <el-button :type="banStatus ? 'danger' : 'success'" disabled>
          {{ banStatus ? 'banned' : 'fine' }}
        </el-button>
      </div>

      <div class="item-account" v-if="!banStatus">
        <div class="entry">ban until:</div>
        <div class="oneline-text-area">
          {{ new Date(banUntil).toLocaleString() }}
        </div>
      </div>

      <div class="item-account" v-if="!banStatus">
        <div class="entry">join Time:</div>
        <div class="oneline-text-area">
          {{ new Date(joinTime).toLocaleString() }}
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  data: function () {
    return {
      username: '',
      password: '',
      nickname: '',
      banUntil: 0,
      joinTime: 0,
      admin: false,
      socialList: []
    }
  },
  computed: {
    banStatus: function () {
      return new Date().getTime() < this.banUntil
    }
  },
  created: function () {
    const tokenCookie = flea.util.cookie.get('token')
    const param = {}
    param.token = tokenCookie
    flea.api.request(flea.api.url.user.getMyDetail, param)
      .then(res => res.json()).then(this.handleLoad)
  },
  methods: {
    modifyAvatar: function () {
      const handleAddPic = (url) => {
        const param = {
          token: flea.util.cookie.get('token'),
          avatarUrl: url
        }
        flea.api.request(flea.api.url.user.modifyAvatar, param).then(res => {
          this.refreshRoute()
        })
      }
      const handlePicUpload = (url) => {
        if (url === '') {
          this.$message({
            message: 'picture upload failed',
            type: 'error'
          })
        } else {
          this.$message('picture file upload')
          handleAddPic(url)
        }
      }

      const picFileDom = document.getElementById('avatarFile')
      const pic = picFileDom.files[0]
      flea.api.picture.upload(pic).then(handlePicUpload)
    },
    handleLoad: function (body) {
      if (body.success === true) {
        const detail = body.data
        this.username = detail.username
        this.nickname = detail.nickname
        this.banUntil = detail.banUntil
        this.joinTime = detail.joinTime
        this.admin = detail.admin
        this.socialList = detail.socialList
      } else {
        this.$message({
          message: 'failed to get profile',
          type: 'error'
        })
      }
    },
    refreshRoute: function () {
      window.location.reload(false)
    }
  }
}
</script>

<style>
.input-small {
  width: 180px;
}

.item-account {
  margin-bottom: 4px;
  display: flex;
  line-height: 40px;
}

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

.entry {
  width: 120px;
}
</style>>
