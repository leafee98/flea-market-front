<template>
  <div>
    <table>
      <tr>
        <td>product name</td>
        <td>
          <el-input v-if="edit" v-model="detail.productName"/>
          <div class="oneline-text-area" v-else>{{ detail.productName }}</div>
        </td>
      </tr>

      <tr>
        <td>product price</td>
        <td>
          <el-input v-if="edit" v-model="detail.expectedPrice"/>
          <div class="oneline-text-area" v-else>{{ detail.expectedPrice }}</div>
        </td>
      </tr>

      <tr>
        <td>product id</td>
        <td>
          <el-input v-if="edit" v-model="detail.productId" disabled/>
          <div class="oneline-text-area" v-else>{{ detail.productId}}</div>
        </td>
      </tr>

      <tr>
        <td>product status</td>
        <td>
          <el-input v-if="edit" v-model="detail.productStatus" disabled/>
          <div class="oneline-text-area" v-else>{{ detail.productStatus }}</div>
        </td>
      </tr>

      <tr>
        <td>publish time</td>
        <td>
          <el-input v-if="edit" v-model="publishTimeStr" disabled/>
          <div class="oneline-text-area" v-else>{{ publishTimeStr }}</div>
        </td>
      </tr>
    </table>

    <div>
      <div class="pic-container"
        v-for="pic in detail.pics" :key="pic.productPicUrl">
        <el-image :src="pic.productPicUrl"
          class="pic-item"
          :preview-src-list="new Array(pic.productPicUrl)">
        </el-image>
        <el-button v-if="edit"
          style="margin-left: 8px"
          @click="dropPic(pic)">
          drop
        </el-button>
      </div>
    </div>

    <div v-if="edit">
      <input style="width: 300px" type="file" id="picFile" />
      <el-button @click="newPic">new picture</el-button>
    </div>

    <el-input type="textarea" v-model="detail.productDetail"></el-input>
    <div stype="display: flex" v-if="edit">
      <el-button @click="editProduct">edit</el-button>
      <el-button @click="update">update</el-button>
      <el-button @click="finishEdit">finish edit</el-button>
      <el-button @click="dropProduct">drop product</el-button>
    </div>

    <div style="display: flex" v-if="detail.productStatus === 'censoring' && admin">
      <el-button @click="censorPass">censor pass</el-button>
      <el-button @click="censorDeny">censor deny</el-button>
    </div>
    <div style="display: flex" v-if="logged">
      <el-button v-if="detail.productStatus === 'selling'" @click="orderProduct">order</el-button>
      <el-button v-if="confirmable" @click="confirmOrder">confrim order</el-button>
      <el-button v-if="confirmable" @click="cancelOrder">cancel order</el-button>
    </div>

    <div class="top-dash-border" style="margin-top: 16px; padding-top: 8px;">
      <div>
        <!-- other's comment -->
        <div class="top-tight-dash-border"
          v-for="c in commentList" :key="c.commentId">
          <div class="action-element"
            @click="viewDetail(c.user.username)"
            style="display: flex; padding: 4px">
            <el-avatar class="action-element"
              @click="viewDetail(c.user.username)"
              size="small"
              :src="c.user.avatarUrl"></el-avatar>
            <span
              style="align-self: center; margin-left: 20px; color: #606266; font-size: small">
              {{ c.user.nickname }}
            </span>
          </div>
          <div class="multiline-text-area" style="margin-top: 4px">
            {{ c.content }}
          </div>
        </div>
      </div>
      <div class="top-dash-border" style="margin-top: 16px; padding-top: 8px;">
        <!-- write comment -->
        <el-button @click="comment">post comment</el-button>
        <el-input type="textarea" v-model="commentContent"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  props: [
    'detail',
    'edit'
  ],
  data: function () {
    return {
      admin: false,
      commentList: [],
      commentContent: ''
    }
  },
  computed: {
    publishTimeStr: {
      get: function () {
        return new Date(this.detail.publishTime).toLocaleString()
      }
    },
    token: {
      get: function () {
        return flea.util.cookie.get('token')
      }
    },
    logged: {
      get: function () {
        return this.token !== undefined
      }
    },
    confirmable: {
      get: function () {
        return this.detail.productStatus === 'ordered' ||
          this.detail.productStatus === 'confirm_buyer' ||
          this.detail.productStatus === 'confirm_seller'
      }
    }
  },
  created: function () {
    this.loadAdmin()
    this.loadComments()
  },
  watch: {
    detail: function () {
      this.loadComments()
    }
  },
  methods: {
    loadAdmin: function () {
      flea.api.request(flea.api.url.user.getMyDetail, { token: this.token })
        .then(res => res.json()).then(body => { this.admin = body.data.admin })
    },
    loadComments: function () {
      if (this.detail.productId === undefined) { return }

      const param = { productId: this.detail.productId }
      flea.api.request(flea.api.url.product.getComments, param)
        .then(res => res.json()).then(body => { this.commentList = body.data })
    },

    update: function () {
      const token = flea.util.cookie.get('token')
      const productId = this.detail.productId
      const productName = this.detail.productName
      const productDetail = this.detail.productDetail
      const expectedPrice = this.detail.expectedPrice

      const paramProductName =
        { token: token, productId: productId, productName: productName }

      const paramProductDetail =
        { token: token, productId: productId, productDetail: productDetail }

      const paramProductPrice =
        { token: token, productId: productId, price: expectedPrice }

      const p1 = flea.api.request(flea.api.url.product.editProductName, paramProductName).then(res => res.json())
      const p2 = flea.api.request(flea.api.url.product.editProductDetail, paramProductDetail).then(res => res.json())
      const p3 = flea.api.request(flea.api.url.product.editExpectedPrice, paramProductPrice).then(res => res.json())
      Promise.all([p1, p2, p3])
        .then(bodys => {
          if (bodys[0].success === true &&
            bodys[1].success === true &&
            bodys[2].success === true) {
            this.promptResult(true)
          } else {
            this.promptResult(false)
          }
        })
    },
    newPic: function () {
      const handleAddPic = (url) => {
        const param = {
          token: flea.util.cookie.get('token'),
          productId: this.detail.productId,
          picUrl: url
        }
        flea.api.request(flea.api.url.product.editAddPic, param)
          .then(res => res.json()).then(body => this.promptResult(body.success))
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

      const picFileDom = document.getElementById('picFile')
      const pic = picFileDom.files[0]
      flea.api.picture.upload(pic).then(handlePicUpload)
    },
    dropPic: function (pic) {
      const param = {
        token: flea.util.cookie.get('token'),
        productId: this.detail.productId,
        picId: pic.productPicId
      }
      flea.api.request(flea.api.url.product.editDeletePic, param)
        .then(this.refreshRoute)
    },

    finishEdit: function () {
      const param = {
        token: flea.util.cookie.get('token'),
        productId: this.detail.productId
      }
      flea.api.request(flea.api.url.product.editFinish, param)
        .then(res => res.json()).then(this.refreshRoute)
    },
    editProduct: function () {
      const param = {
        token: flea.util.cookie.get('token'),
        productId: this.detail.productId
      }
      flea.api.request(flea.api.url.product.editProduct, param)
        .then(this.refreshRoute)
    },
    dropProduct: function () {
      const param = {
        token: flea.util.cookie.get('token'),
        productId: this.detail.productId
      }
      flea.api.request(flea.api.url.product.deleteProduct, param)
        .then(this.refreshRoute)
    },

    censorPass: function () {
      const param = { token: this.token, productId: this.detail.productId, pass: true }
      flea.api.request(flea.api.url.admin.censorProduct, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
    },
    censorDeny: function () {
      const param = { token: this.token, productId: this.detail.productId, pass: false }
      flea.api.request(flea.api.url.admin.censorProduct, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
    },

    comment: function () {
      const param = {
        token: this.token,
        productId: this.detail.productId,
        content: this.commentContent
      }
      flea.api.request(flea.api.url.product.comment, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
        .then(this.loadComments)
    },
    orderProduct: function () {
      const param = { token: this.token, productId: this.detail.productId }
      flea.api.request(flea.api.url.product.orderProduct, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
    },
    confirmOrder: function () {
      const param = { token: this.token, productId: this.detail.productId }
      flea.api.request(flea.api.url.product.confirmOrder, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
    },
    cancelOrder: function () {
      const param = { token: this.token, productId: this.detail.productId }
      flea.api.request(flea.api.url.product.cancelOrder, param)
        .then(res => res.json()).then(body => this.promptResult(body.success))
    },

    viewDetail: function (username) {
      this.$router.push({ name: 'profile', params: { username: username } })
    },

    refreshRoute: function () {
      setTimeout(() => {
        window.location.reload(false)
      }, 1000)
    },
    promptResult: function (success) {
      if (success === true) {
        this.$message.success('action success')
      } else {
        this.$message.error('action failed')
      }
      this.refreshRoute()
    }
  }
}
</script>

<style>
.pic-container {
  display: flex;
  align-items: center;
  margin-block: 2px;
}

.pic-item {
  width: 100px;
  height: 100px
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

.multiline-text-area {
  color: #606266;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px 20px 12px 20px;
}

.top-dash-border {
  border-top: 2px dashed #d7dae2
}

.top-tight-dash-border {
  border-top: 1px dashed #d7dae2;
  margin-bottom: 4px;
  margin-top: 4px;
  padding-top: 4px;
  box-sizing: border-box;
}

.action-element {
  cursor: pointer;
  transition: 0.5s
}

.action-element:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>
