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
          <div class="oneline-text-area" v-else>{{ detail.publishTime }}</div>
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
        <el-button @click="dropPic(pic)">drop</el-button>
      </div>
    </div>

    <div v-if="edit">
      <input type="file" id="picFile" />
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
      admin: false
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
    }
  },
  created: function () {
    flea.api.request(flea.api.url.user.getMyDetail, { token: this.token })
      .then(res => res.json()).then(body => { this.admin = body.data.admin })
  },
  methods: {
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

      const p1 = flea.api.request(flea.api.url.product.editProductName, paramProductName)
      const p2 = flea.api.request(flea.api.url.product.editProductDetail, paramProductDetail)
      const p3 = flea.api.request(flea.api.url.product.editExpectedPrice, paramProductPrice)
      Promise.all([p1, p2, p3]).then(this.refreshRoute)
    },
    newPic: function () {
      const handleAddPic = (url) => {
        const param = {
          token: flea.util.cookie.get('token'),
          productId: this.detail.productId,
          picUrl: url
        }
        flea.api.request(flea.api.url.product.editAddPic, param).then(res => {
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
    refreshRoute: function () {
      setTimeout(() => {
        window.location.reload(false)
      }, 500)
    },
    censorPass: function () {
      const param = { token: this.token, productId: this.detail.productId, pass: true }
      console.log(param)
      flea.api.request(flea.api.url.admin.censorProduct, param)
        .then(res => res.json()).then(this.handleCensorResult)
    },
    censorDeny: function () {
      const param = { token: this.token, productId: this.detail.productId, pass: false }
      flea.api.request(flea.api.url.admin.censorProduct, param)
        .then(res => res.json()).then(this.handleCensorResult)
    },
    handleCensorResult: function (body) {
      if (body.success === true) {
        this.$message('action success')
      } else {
        this.$message({ message: 'action failed for unknown reason', type: 'error' })
      }
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
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
