<template>
  <div style="display: flex">
    <compo-product-detail-table style="width: 450px"
      :detail="detail" :edit="false">
    </compo-product-detail-table>

    <compo-user-summary
      id="compo-user-summary"
      :seller="seller">
    </compo-user-summary>
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  data: function () {
    return {
      productId: 0,
      detail: {},
      seller: {}
    }
  },
  methods: {
    loadDetail: function () {
      const loadData = (body) => {
        if (body.success) {
          this.detail = body.data
          this.seller = this.detail.seller
        } else {
          this.$message({
            message: 'failed to get product detail',
            type: 'error'
          })
        }
      }

      this.productId = this.$route.params.productId
      const params = {
        productId: this.productId
      }
      flea.api.request(flea.api.url.product.getProductDetail, params)
        .then(res => res.json()).then(loadData)
    }
  },
  created: function () {
    this.loadDetail()
  }
}
</script>

<style>
#compo-user-summary {
  margin-left: 10%;
}
</style>
