<template>
  <div>
    <!-- 年月 -->
    <el-row type="flex" justify="end">
      <el-select v-model="selectYear" placeholder="" size="small" style="width: 120px" @change="selectChange">
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select v-model="selectMonth" placeholder="" size="small" style="width: 120px" @change="selectChange">
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button size="small" @click="clickToday">今天</el-button>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate" style="pointer-events:none">
      <template v-slot:dateCell="{date,data}">
        <div class="date-content">
          <span class="text">{{ data.day|getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },

  data() {
    return {
      yearList: [],
      today: {},
      selectYear: null,
      selectMonth: null,
      currentDate: null
    }
  },
  created() {
    this.clickToday()
    // 年份选择的范围 5年前到5年后
    this.yearList = Array.from(Array(11), (v, i) => i + this.selectYear - 5)
  },
  methods: {
    // 选择栏改变
    selectChange() {
      // 本月选中今天，否则选中1号
      const dd = this.selectYear === this.today.getFullYear() && this.selectMonth === this.today.getMonth() + 1 ? this.today.getDate() : '1'
      // 日历改变
      this.currentDate = `${this.selectYear}-${this.selectMonth}-${dd}`
    },
    // 点击今天
    clickToday() {
      this.today = new Date()
      // 选择栏重置今天
      this.selectYear = this.today.getFullYear()
      this.selectMonth = this.today.getMonth() + 1
      // 日历重置今天
      this.currentDate = this.today
    },
    // 判断是否为周末
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style  scoped>
 ::v-deep .el-calendar-day {
  height:  auto;
 }
 ::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 ::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 ::v-deep .el-calendar__header {
   display: none
 }
</style>
