<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <el-tabs value="first">
          <el-tab-pane label="组织架构" name="first" />
        </el-tabs>
        <!-- 顶部根节点 -->
        <div class="company">
          <tree-tools :tree-node="company" :is-root="true" :icon="'el-icon-s-cooperation'" @addDepts="addDepts" />
        </div>
        <!-- 部门树状图 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
        >
          <!-- 传入内容 有多少节点就循环多少次 -->
          <!-- 作用域插槽 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增弹层组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="treeNode" @submitAddDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/'
import AddDept from './components/add-dept.vue'
export default {
  activeName: 'first',
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {
        // name: '传智播客教育科技股份有限公司',
        // manager: '负责人'
      },
      departs: [
        // {
        // name: '总裁办',
        // manager: '曹操',
        // children: [
        //   {
        //     name: '董事会',
        //     manager: '曹丕',
        //     children: [{ name: '经理部', manager: '司马懿' }]
        //   }
        // ]
        // },
        // { name: '行政部', manager: '刘备' },
        // { name: '人事部', manager: '孙权' }
      ],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      treeNode: null,
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 发起部门数据的请求，渲染页面
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    // 添加事件 接收来自tree-tools被点击的部门节点，并把数据传给弹层组件
    addDepts(treeNode) {
      // 用来弹出弹层
      this.showDialog = true
      // 告诉弹层要操作哪个部门
      this.treeNode = treeNode
    },
    // 编辑事件
    async editDepts(treeNode) {
      // 告诉弹层要操作哪个部门
      this.treeNode = treeNode
      await this.$refs.addDept.getDepartDetail(this.treeNode.id)
      // 用来弹出弹层
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 3% 2% 0 5%;
  font-size: 14px;
}
::v-deep .el-tree-node__content {
  height: 36px;
}
.el-tree,
.company {
  padding: 30px 0;
  margin: 0 5%;
}
.company {
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  color: #000;
}

::v-deep .el-tree-node__expand-icon {
  color: #000;
}
::v-deep .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}
</style>
