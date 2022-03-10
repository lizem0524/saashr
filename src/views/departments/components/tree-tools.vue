<template>
  <div class="tree-container">
    <!-- 左侧内容 -->
    <i :class="icon" />
    <span>{{ treeNode.name }}</span>
    <div class="tree-right">
      <span>
        {{ treeNode.manager }}
      </span>
      <!-- 放置下拉菜单 -->
      <el-dropdown @command="operateDepts">
        <!-- 内容 -->
        <span>操作
          <i class="el-icon-arrow-down" />
        </span>
        <!-- 具名插槽 -->
        <el-dropdown-menu slot="dropdown">
          <!-- 下拉选项 -->
          <el-dropdown-item command="add">添加子部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 右侧内容 -->
  </div>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'el-icon-s-custom'
    }
  },
  methods: {
    // 点击添加 编辑 删除时触发
    operateDepts(type) {
      if (type === 'add') {
        this.$emit('addDepts', this.treeNode)
        console.log('add')
      } else if (type === 'edit') {
        console.log('edit')
      } else {
        this.$confirm('您确定要删除该部门吗？').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          this.$emit('delDepts')
          this.$message.success('删除成功')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-container {
  width: 100%;
  color: #000;
  i {
    padding-right: 6px;
  }
}
.tree-right {
  float: right;
}
.tree-right span {
  padding-left: 20px;
}
</style>
