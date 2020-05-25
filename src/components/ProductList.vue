<template>
  <div>
    <el-table
      :data="productList"
      @row-click="goto">
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
  props: [
    'listType'
  ],
  data: function () {
    return {
      productList: [],
      type: {
        selling: 'selling',
        myProducts: 'myProducts',
        censoringProducts: 'censoringProducts',
        boughtProducts: 'boughtProducts'
      }
    }
  },
  methods: {
    parepareFunctions: function () {
      if (this.listType === this.type.selling) {
        this.request = () => {
          return flea.api.request(flea.api.url.product.getProductList, {})
        }
        this.goto = (row, column, event) => {
          this.$router.push({ name: 'productDetail', params: { productId: row.productId } })
        }
      } else if (this.listType === this.type.myProducts) {
        this.request = () => {
          return flea.api.request(flea.api.url.product.getMyProductList,
            { token: flea.util.cookie.get('token') })
        }
        this.goto = (row, column, event) => {
          this.$router.push({ name: 'productDetailEdit', params: { productId: row.productId } })
        }
      } else if (this.listType === this.type.censoringProducts) {
        this.request = () => {
          return flea.api.request(flea.api.url.admin.getCensoringProducts,
            { token: flea.util.cookie.get('token') })
        }
        this.goto = (row, column, event) => {
          this.$router.push({ name: 'productDetail', params: { productId: row.productId } })
        }
      } else if (this.listType === this.type.boughtProducts) {
        this.request = () => {
          return flea.api.request(flea.api.url.product.getBoughtProductList,
            { token: flea.util.cookie.get('token') })
        }
        this.goto = (row, column, event) => {
          this.$router.push({ name: 'productDetail', params: { productId: row.productId } })
        }
      } else {
        this.$message({
          message: 'unknown list type' + this.listType,
          type: 'error'
        })
      }
    },
    request: function () {},
    goto: function () {},
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
      this.request().then(res => res.json()).then(loadProductItem)
    }
  },
  created: function () {
    this.parepareFunctions()
    this.loadProduct()
  }
}
</script>

<style>

</style>
