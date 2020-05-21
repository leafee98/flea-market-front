<template>
  <div id='app'>
    <input type="file" id="picFile"/>
    <button @click="upload">read byte</button>
    <hr />
  </div>
</template>

<script>
import flea from '@/assets/impl.js'

export default {
  name: 'PictureUpload',
  methods: {
    upload: function () {
      const picFile = document.getElementById('picFile').files[0]
      flea.api.picture.upload(picFile)
    }
  }
}
</script>
