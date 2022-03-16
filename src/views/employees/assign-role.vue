<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 多选框组 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 确定和取消 -->
    <div slot="footer" class="dialog-footer">
      <el-button size="middle" @click="btnCancel">取 消</el-button>
      <el-button size="middle" type="primary" @click="btnOK">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user.js'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    userId: {
      type: String,
      default: null
    },
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      roleIds: []
    }
  },
  created() {
    // 弹层角色复选框渲染
    this.getRoleList()
  },
  methods: {
    // 弹层角色复选框渲染
    async getRoleList() {
      // 获取角色列表
      const { rows } = await getRoleList({ page: 1, pagesize: 50 }) // 默认10条 角色不会太多
      this.list = rows
    },
    // 根据id获取角色详情信息
    async getUserDetailById(id) {
      // 结构出角色已有的权限列表
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    // 弹层关闭按钮
    btnCancel() {
      this.$emit('update:showRoleDialog', false)
      this.roleIds = []
    },
    // 弹层确定
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('角色分配成功')
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
