<template>
  <div>
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  created: function () {
    const username = this.$route.params.username
    this.startChat(username)
  },
  methods: {
    startChat: function (username) {
      const param = {
        token: flea.util.cookie.get('token'),
        username: username
      }
      flea.api.request(flea.api.url.chat.startChatSession, param)
        .then(res => res.json())
        .then(body => {
          if (body.success) {
            this.jumpChat(body.data)
          } else {
            this.promptResult(false, null, 'failed to start chat')
          }
        })
    },
    jumpChat: function (sessionId) {
      this.$router.push({ name: 'chatSession', params: { chatSessionId: sessionId } })
    },

    promptResult: function (success, successMsg, failedMsg) {
      if (successMsg === undefined) { successMsg = 'action success' }
      if (failedMsg === undefined) { failedMsg = 'action failed' }

      if (success) {
        this.$message.success(successMsg)
        return Promise.resolve()
      } else {
        this.$message.error(failedMsg)
        return Promise.reject(new Error('failed'))
      }
    }
  }
}
</script>

<style>

</style>
