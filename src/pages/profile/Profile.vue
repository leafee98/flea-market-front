<template>
  <el-container>
    <el-main>
      <div style="width: min-content; display: grid">
        <el-avatar
          :src="avatarUrl"
          :size="128"
          style="margin: auto; margin-bottom: 16px">
          {{ nickname }}
        </el-avatar>
        <div class="item-account" v-if="myself">
          <div class="entry">avatar:</div>
          <div class="oneline-text-area">
            <input id="avatarFile" type="file" class="input-small" />
          </div>
          <el-button type="primary" @click="updateAvatar">update</el-button>
        </div>
        <div class="item-account">
          <div class="entry">username:</div>
          <div class="oneline-text-area">
            {{ username }}
          </div>
        </div>

        <div class="item-account" v-if="myself">
          <div class="entry">password:</div>
          <el-input v-model="password" class="input-small" type="password"></el-input>
          <el-button type="primary" @click="updatePassword">modify</el-button>
        </div>

        <div class="item-account">
          <div class="entry">nickname:</div>
          <el-input v-if="myself" v-model="nickname" class="input-small"></el-input>
          <div v-else class="oneline-text-area">{{ nickname }}</div>
          <el-button v-if="myself" type="primary" @click="updateNickname">save</el-button>
        </div>

        <div class="item-account">
          <div class="entry">admin:</div>
          <div class="oneline-text-area">{{ admin }}</div>
          <el-button v-if="IAmAdmin && !this.admin" @click="grantAdmin">grant</el-button>
        </div>

        <div class="item-account">
          <div class="entry">ban status:</div>
          <el-button style="width: 50px; padding-left: 10px; padding-right: 10px"
            :type="banned ? 'danger' : 'success'" disabled>
            {{ banned ? 'ban' : 'fine' }}
          </el-button>
          <div v-if="IAmAdmin"
            style="display: flex">
            <el-input
              style="width: 84px; margin-left: 8px; margin-right: 8px;"
              placeholder="Day to ban"
              v-model="banDay"></el-input>
            <el-button @click="banUser">ban</el-button>
          </div>
        </div>

        <div class="item-account" v-if="banned">
          <div class="entry">ban until:</div>
          <div class="oneline-text-area">
            {{ new Date(banUntil).toLocaleString() }}
          </div>
        </div>

        <div class="item-account">
          <div class="entry">join Time:</div>
          <div class="oneline-text-area">
            {{ new Date(joinTime).toLocaleString() }}
          </div>
        </div>

        <div style="margin-top: 32px; display: grid">
          <strong>social list</strong>
          <div class="item-account" v-for="social in socialList" :key="social.socialId">
            <div v-if="myself" style="display: flex">
              <div class="entry">{{ social.socialType }}</div>
              <div class="oneline-text-area">{{ social.socialUrl }}</div>
              <el-button @click="removeSocial(social)">drop</el-button>
            </div>
            <div v-else style="display: flex">
              <div class="entry">{{ social.socialType }}</div>
              <div class="oneline-text-area">{{ social.socialUrl }}</div>
            </div>
          </div>

          <div v-if="myself" style="display: flex">
              <el-input class="entry-input"
                placeholder="social type"
                v-model="newSocial.socialType"></el-input>
              <el-input class="input-small"
                placeholder="social url"
                v-model="newSocial.socialUrl"></el-input>
              <el-button @click="addSocial">add</el-button>
          </div>

          <el-button v-else @click="startChat">start chat</el-button>
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
      avatarUrl: '',
      username: '',
      password: '',
      nickname: '',
      banUntil: 0,
      joinTime: 0,
      admin: false,
      socialList: [],

      newSocial: {
        socialType: '',
        socialUrl: ''
      },

      myself: true,
      IAmAdmin: false,
      banDay: 0
    }
  },
  computed: {
    banned: function () {
      return new Date().getTime() < this.banUntil
    }
  },
  created: function () {
    const username = this.$route.params.username
    if (username === undefined) {
      this.loadMyself()
    } else {
      this.myself = false
      this.loadOther(username)
    }

    this.loadIAmAdmin()
  },
  methods: {
    loadMyself: function () {
      const tokenCookie = flea.util.cookie.get('token')
      const param = {}
      param.token = tokenCookie
      flea.api.request(flea.api.url.user.getMyDetail, param)
        .then(res => res.json()).then(this.handleLoad)
    },
    loadOther: function (username) {
      const param = { username: username }
      flea.api.request(flea.api.url.user.getUserDetail, param)
        .then(res => res.json()).then(this.handleLoad)
    },
    handleLoad: function (body) {
      if (body.success === true) {
        const detail = body.data
        this.avatarUrl = detail.avatarUrl
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
    loadIAmAdmin: function () {
      const param = { token: flea.util.cookie.get('token') }
      flea.api.request(flea.api.url.user.getMyDetail, param)
        .then(res => res.json()).then(body => { this.IAmAdmin = body.data.admin })
    },

    banUser: function () {
      const param = { token: flea.util.cookie.get('token'), username: this.username, day: this.banDay }
      flea.api.request(flea.api.url.admin.banUser, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
      setTimeout(this.refreshRoute, 800)
    },
    grantAdmin: function () {
      const param = { token: flea.util.cookie.get('token'), username: this.username }
      flea.api.request(flea.api.url.admin.grantUser, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
      setTimeout(this.refreshRoute, 800)
    },

    updatePassword: function () {
      const param = { token: flea.util.cookie.get('token'), password: this.password }
      flea.api.request(flea.api.url.user.modifyPassword, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
      setTimeout(this.refreshRoute, 800)
    },
    updateNickname: function () {
      const param = { token: flea.util.cookie.get('token'), nickname: this.nickname }
      flea.api.request(flea.api.url.user.modifyNickname, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
      setTimeout(this.refreshRoute, 800)
    },
    updateAvatar: function () {
      const handleAddPic = (url) => {
        const param = {
          token: flea.util.cookie.get('token'),
          avatarUrl: url
        }
        flea.api.request(flea.api.url.user.modifyAvatar, param).then(res => {
          setTimeout(this.refreshRoute, 1500)
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
    addSocial: function () {
      const param = {
        token: flea.util.cookie.get('token'),
        socialType: this.newSocial.socialType,
        socialUrl: this.newSocial.socialUrl
      }
      flea.api.request(flea.api.url.user.addSocial, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
      setTimeout(this.refreshRoute, 800)
    },
    removeSocial: function (social) {
      const param = {
        token: flea.util.cookie.get('token'),
        socialId: social.socialId
      }
      flea.api.request(flea.api.url.user.removeSocial, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
      setTimeout(this.refreshRoute, 800)
    },

    startChat: function () {
      this.$router.push({ name: 'startChat', params: { username: this.username } })
    },

    refreshRoute: function () {
      window.location.reload(false)
    },
    promptResult: function (success) {
      if (success) {
        this.$message.success('action success')
      } else {
        this.$message.error('action failed')
      }
    }
  }
}
</script>

<style>
.input-small {
  width: 220px;
  margin-right: 8px;
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
  margin-right: 8px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-sizing: border-box;
}

.entry {
  width: 120px;
  text-align: center;
}

.entry-input {
  width: 112px;
  margin-right: 8px
}
</style>>
