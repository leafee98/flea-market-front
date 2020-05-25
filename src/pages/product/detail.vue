<template>
  <div>
    <compo-product-detail-table
      :detail="detail" :edit="false">
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

</style>
