<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/empoyees'
export default {
  methods: {
    async success({ header, results }) {
      // excel表头和后台接口名称的映射
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 对results中的数据进行处理，修改中文键名，格式化时间
      results.forEach(item => {
        for (const key in item) {
          // 时间需要特殊处理
          if (key === '入职日期' || key === '转正日期') {
            item[key] = new Date(this.formatDate(item[key], '/'))
          }
          // 英文key
          const newKey = userRelations[key]
          if (newKey) {
            // 添加英文的键和值
            item[newKey] = item[key]
            // 删除中文的键和值
            delete item[key]
          }
        }
      })
      await importEmployee(results)
      this.$message.success('导入excel成功')
      this.$router.back()
    },
    // 定义一个excel日期格式化的函数
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
