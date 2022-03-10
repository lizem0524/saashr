<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <el-tabs value="first">
          <el-tab-pane label="组织架构" name="first">组织架构</el-tab-pane>
        </el-tabs>
        <!-- 顶部根节点 -->
        <div class="company">
          <tree-tools :tree-node="company" :is-root="true" :icon="'el-icon-s-cooperation'" @addDepts="addDepts" />
        </div>
        <!-- 部门树状图 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 有多少节点就循环多少次 -->
          <!-- 作用域插槽 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增弹层组件 -->
    <add-dept :show-dialog="showDialog" :tree-node="treeNode" @submitAddDepts="getDepartments" />
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
        name: '传智播客教育科技股份有限公司',
        manager: '负责人'
      },
      departs: [
        {
          name: '总裁办',
          manager: '曹操大',
          children: [
            {
              name: '董事会',
              manager: '曹丕',
              children: [{ name: '经理部', manager: '司马懿' }]
            }
          ]
        },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      treeNode: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
    },
    addDepts(treeNode) {
      this.showDialog = true
      this.treeNode = treeNode
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
#pane-first {
  display: none;
}
</style>
