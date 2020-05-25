<template>
  <div>
    <el-table
      :data="productList"
      @row-click="gotoEdit">
      <el-table-column
        label="id"
        prop="productId"
        width="52px">
      </el-table-column>
      <el-table-column
        label="product name"
        prop="productName">
      </el-table-column>
      <el-table-column
        label="publish time"
        prop="publishTime">
      </el-table-column>
      <el-table-column
        label="seller nickname"
        prop="sellerNickName">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  data: function () {
    return {
      productList: []
    }
  },
  methods: {
    loadProduct: function () {
      const loadProductItem = (body) => {
        const data = body.data
        for (const index in data) {
          const item = data[index]
          this.productList.push({
            productId: item.productId,
            productName: item.productName,
            publishTime: new Date(item.publishTime).toLocaleString(),
            sellerUsername: item.seller.username,
            sellerNickName: item.seller.nickname,
            sellerAvatarUrl: item.seller.avatarUrl
          })
        }
      }
      const param = {
        token: flea.util.cookie.get('token')
      }
      flea.api.request(flea.api.url.product.getMyProductList, param)
        .then(res => res.json()).then(loadProductItem)
    },
    gotoEdit: function (row, column, event) {
      this.$router.push({ name: 'productDetailEdit', params: { productId: row.productId } })
    }
  },
  created: function () {
    this.loadProduct()
  }
}
</script>

<style>

</style>
