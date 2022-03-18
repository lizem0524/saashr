<template>
  <el-dropdown trigger="click" @command="chanegeLanguage">
    <div>
      <svg-icon icon-class="language" style="color:#fff;font-size:20px" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="this.$i18n.locale==='zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="this.$i18n.locale==='en'" command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    chanegeLanguage(type) {
      Cookie.set('language', type)
      this.$i18n.locale = type
      this.$message.success('切换成功')
    }
  }
}
</script>

<style>

</style>
