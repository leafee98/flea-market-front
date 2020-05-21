import Vue from 'vue'
import testComponent from './TestComponent.vue'

new Vue({
  render: h => h(testComponent)
}).$mount('#app')
