<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span>
            共{{ total }}条记录
          </span>
        </template>
        <!-- 右侧excel导入 导出 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <el-table :data="list" border="">
        <el-table-column label="序号" align="center" type="index" sortable="" min-width="10%" />
        <el-table-column label="姓名" align="center" prop="username" sortable="" min-width="10%" />
        <!-- 头像 -->
        <el-table-column label="头像" align="center" prop="username" min-width="6%">
          <template v-slot="{row}">
            <img
              v-imageerror="require('@/assets/common/userHeader.jpg')"
              :src="row.staffPhoto"
              style="width:100% ;border-radius:50%"
              @click="showQrCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" align="center" prop="workNumber" sortable="" min-width="10%" />
        <el-table-column label="聘用形式" align="center" prop="formOfEmployment" sortable="" min-width="10%" :formatter="formatEmployment" />
        <el-table-column label="部门" align="center" prop="departmentName" sortable="" min-width="10%" />
        <el-table-column label="入职时间" align="center" prop="timeOfEntry" sortable="" min-width="10%">
          <template v-slot="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" align="center" prop="enableState" sortable="" min-width="10%">
          <template v-slot="{row}">
            <el-switch
              :value="row.enableState==1"
            />
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" align="center" min-width="20%">
          <template v-slot="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height:60px">
        <el-pagination
          background
          layout="prev,pager,next"
          :current-page="page.page"
          :page-size="page.size"
          :total="total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 添加员工的弹层组件 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 点击头像的弹层二维码组件 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas">1</canvas>
      </el-row>
    </el-dialog>
    <!-- 角色分配弹层组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>

</template>

<script>
import { getEmployeesList, delEmployee } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee.vue'
import AssignRole from '@/views/employees/assign-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [],
      total: 0,
      page: {
        page: 1,
        size: 10
      },
      loading: false,
      value: true,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: null
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    // 渲染页面的函数
    async getEmployeesList() {
      this.loading = true
      const { rows, total } = await getEmployeesList(this.page)
      this.list = rows
      this.total = total
      this.loading = false
    },
    // 监听页码点击事件
    changePage(newPage) {
      // 修改data中的page
      this.page.page = newPage
      // 重新拉取数据
      this.getEmployeesList()
    },
    // 按照枚举文件的映射，把聘用形式渲染到页面
    formatEmployment(row, column, cellValue, index) {
      // 拿到cellValue在枚举文件中对应的状态对象
      const hireType = EmployeesEnum.hireType.find(item => item.id === cellValue)
      // 数组的find方法的返回值有可能为undefined,因此手动格式化为未知
      return hireType ? hireType.value : '未知'
    },
    // 删除员工
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗？')
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeesList()
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel文件
    exportData() {
      // 定义映射关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载excel导出工具，为了使用其中的export_json_to_excel方法
      import('@/vendor/Export2Excel').then(async excel => {
        // 从后端获取所有员工的数据
        const { rows } = await getEmployeesList({ page: 1, size: this.total })
        console.log(rows)
        // 格式化数据
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // 导出excel
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          multiHeader, // header上方额外添加一行表头
          merges, // 合并表头
          data, // 具体数据 必填 [['zs',1000],['ls',2000]]形式
          filename: '员工资料表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 格式化导出excel的数据的方法  return [['zs',1000],['ls',2000]]的形式
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // 当循环到timeOfEntry或correctionTime时，格式化时间并返回
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') { // 当循环到聘用形式时，根据枚举文件把状态码转化成文字
            const hireType = EmployeesEnum.hireType.find(obj => obj.id === item[headers[key]])
            return hireType ? hireType.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // formatJson(headers, rows) {
    //   return rows.map(item => Object.keys(headers).map(key => item[headers[key]])
    //   )
    // }
    // 点击头像弹二维码
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户未上传头像')
      }
    },
    // 点击角色事件
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(this.userId) // 调用弹层组件的获取角色详情的方法
      this.showRoleDialog = true
    }

  }
}
</script>

<style>

</style>
