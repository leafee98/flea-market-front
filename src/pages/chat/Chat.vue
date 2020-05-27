<template>
  <el-container>
    <el-aside>
      <!-- chat session list -->
      <div id="chat-session-list" style="overflow: auto; height: 360px">
        <div class="oneline-text-area"
          style="background-color: #ECECEC; margin-bottom: 8px">
          chat sessions
        </div>
        <div
          v-for="session in chatSessionList"
          :key="session.chatSessionId"
          @click="chatInSession(session.chatSessionId)"
          :class="{
            'oneline-text-area': true,
            'action-element': true,
            'action-element-active': showingChatId == session.chatSessionId
          }"
          style="margin-bottom: 4px">
          {{ session.chatSessionId }}
        </div>
      </div>
    </el-aside>

    <el-main>
      <compo-chat-panel :chatSessionId="showingChatId"></compo-chat-panel>
    </el-main>
  </el-container>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  data: function () {
    return {
      showingChatId: 0,
      chatSessionList: []
    }
  },
  created: function () {
    this.loadData()
    setInterval(this.loadData, 10000)
  },
  watch: {
    $route: function (from, to) {
      this.loadData()
    }
  },
  methods: {
    loadData: function () {
      this.loadSessionList()
      this.loadParams()
    },
    loadParams: function () {
      this.showingChatId = this.$route.params.chatSessionId
    },
    loadSessionList: function () {
      const param = { token: flea.util.cookie.get('token') }
      flea.api.request(flea.api.url.chat.getChatSessions, param)
        .then(res => res.json())
        .then(body => {
          if (body.success === true) {
            this.chatSessionList = body.data
          } else {
            this.promptResult(false, null, 'load chat session list failed')
          }
        })
    },

    chatInSession: function (sessionId) {
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
.action-element {
  cursor: pointer;
  transition: 0.5s
}

.action-element:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.action-element-active {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
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
</style>
