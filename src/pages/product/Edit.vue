<template>
  <div>
    <compo-product-detail-table
      :detail="detail" :edit="true">
    </compo-product-detail-table>
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  data: function () {
    return {
      productId: 0,
      detail: {}
    }
  },
  methods: {
    loadDetail: function () {
      const loadData = (body) => {
        if (body.success) {
          this.detail = body.data
        } else {
          this.$message({
            message: 'failed to get product detail',
            type: 'error'
          })
          setTimeout(this.jumpMyProduct, 500)
        }
      }

      this.productId = this.$route.params.productId
      const params = {
        productId: this.productId
      }
      flea.api.request(flea.api.url.product.getProductDetail, params)
        .then(res => res.json()).then(loadData)
    },
    jumpMyProduct: function () {
      this.$router.push({ name: 'myProducts' })
    }
  },
  created: function () {
    this.loadDetail()
  },
  beforeRouteUpdate: function (to, from, next) {
    this.loadDetail()
  }
}
</script>

<style>

</style>
