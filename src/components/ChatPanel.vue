<template>
  <div>
    <!-- msgs panel -->
    <div id="msg-panel" style="height: 360px">
      <div id="msg-panel-content" style="overflow-y: auto;">
        <div id="msg-item" style="display: grid" v-for="msg in msgList" :key="msg.chatMsgId">
          <div id="msg-info">
            <div id="user-info"
              class="action-element"
              @click="viewDetail(msg.sender.username)"
              style="display: flex; padding: 8px; width: 40%; margin-left: 8px; margin-top: 4px">
              <el-avatar class="action-element"
                @click="viewDetail(msg.sender.username)"
                size="small"
                :src="msg.sender.avatarUrl"></el-avatar>
              <div style="display: grid">
                <span
                  style="align-self: center; margin-left: 20px; color: #606266; font-size: small">
                  {{ msg.sender.nickname }}
                </span>
                <span
                  style="align-self: center; margin-left: 20px; color: #606266; font-size: small">
                  {{ new Date(msg.messageTime).toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <!-- msg content -->
          <div id="msg-content-panel">
            <div id="msg-content"
              class="multiline-text-area"
              style="margin-left: 6px; margin-right: 6px">
              {{ msg.content }}
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- input panel -->
    <div>
      <el-input
        v-model="msgEditing"
        type="textarea"
        placeholder="input your message here">
      </el-input>
      <el-button @click="sendMsg">send</el-button>
    </div>
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  props: [
    'chatSessionId'
  ],
  data: function () {
    return {
      msgList: [],
      msgEditing: ''
    }
  },
  created: function () {
    this.loadData()
  },
  watch: {
    chatSessionId: function () {
      this.loadData()
    }
  },
  methods: {
    loadData: function () {
      this.loadMsgs()
      setInterval(this.loadMsgs, 10000)
    },
    loadMsgs: function () {
      if (this.chatSessionId === undefined) {
        console.warn('chat session id is undefined, will not load message')
      } else {
        const param = {
          token: flea.util.cookie.get('token'),
          chatSessionId: this.chatSessionId
        }
        flea.api.request(flea.api.url.chat.getMsg, param)
          .then(res => res.json()).then(body => {
            if (!body.success) {
              this.promptResult(false, null, 'failed to load chat messages')
            } else {
              this.msgList = body.data
              // this.scrollMsgPanelToBottom()
            }
          })
      }
    },

    sendMsg: function () {
      const param = {
        token: flea.util.cookie.get('token'),
        chatSessionId: this.chatSessionId,
        content: this.msgEditing
      }
      flea.api.request(flea.api.url.chat.sendMsg, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
        .then(this.loadMsgs)
    },

    viewDetail: function (username) {
      this.$router.push({ name: 'profile', params: { username: username } })
    },

    // scrollMsgPanelToBottom: function () {
    //   const com = document.getElementById('msg-panel-content')
    //   com.scrollTo(0, com.scrollHeight)
    // },
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
#msg-panel {
  display: grid;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-sizing: border-box;
}

.multiline-text-area {
  color: #606266;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px 20px 12px 20px;
}

.action-element {
  cursor: pointer;
  transition: 0.5s
}

.action-element:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

</style>
