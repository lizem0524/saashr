<template>
  <div ref="myDiv" class="rader-echarts" />
</template>

<script>
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

export default {
  mounted() {
    echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])
    var myChart = echarts.init(this.$refs.myDiv)
    myChart.setOption({
      title: {
        text: '绩效'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '销售', max: 100 },
          { name: '管理', max: 100 },
          { name: '信息技术', max: 100 },
          { name: '客服', max: 100 },
          { name: '研发', max: 100 },
          { name: '市场', max: 100 }
        ]
      },
      series: [
        {
          name: '张三 vs 李四',
          type: 'radar',
          data: [
            {
              value: [100, 80, 60, 50, 90, 40],
              name: '李四'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style scoped>
.rader-echarts{
  width:500px;
  height: 400px;
}
</style>
