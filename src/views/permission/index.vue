<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 顶部 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" align="center" prop="code" />
        <el-table-column label="描述" align="center" prop="description" />
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template v-slot="{row}">
            <el-button v-if="row.type==1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible="shwoDialog" @close="btnCancel">
      <el-form ref="formData" label-width="25%" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 80%" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width: 80%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" style="width: 80%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="middle" @click="btnCancel">取 消</el-button>
        <el-button size="middle" type="primary" @click="btnOK">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      shwoDialog: false
    }
  },
  computed: {
    dialogTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除权限节点
    async delPermission(id) {
      try {
        await this.$confirm('确认删除该权限点吗？')
        await delPermission(id)
        this.$message.success('删除成功')
        // 重新渲染页面
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    // 点击添加按钮时注入type和pid,用于提交
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.shwoDialog = true
    },
    // 点击编辑按钮时注入id，用于提交
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.shwoDialog = true
    },
    btnCancel() {
      this.shwoDialog = false
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.formData.resetFields()
    },
    async btnOK() {
      try {
        await this.$refs.formData.validate()
        if (!this.formData.id) {
          await addPermission(this.formData)
          this.$message.success('添加成功')
        } else {
          await updatePermission(this.formData)
          this.$message.success('修改成功')
        }
        this.shwoDialog = false
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
