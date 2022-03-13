<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      请输入姓名
      <input type="text"><button @click="test">检测</button><br>
      <hr>
      <div v-if="a">宇子要死了</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import UploadExcel from '@/components/UploadExcel'

export default {
  name: 'Dashboard',
  data() {
    return {
      a: false
    }
  },
  // components: { UploadExcel },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    test() {
      setTimeout(() => {
        this.a = true
      }, 1000)
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
