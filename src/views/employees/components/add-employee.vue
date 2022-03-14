<template>
  <el-dialog :visible="showDialog" title="你好" @close="btnCancel">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="25%">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 60%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 60%" placeholder="请选择聘用形式">
          <!-- 聘用形式的选择 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width: 80%" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 部门的树形数据组件 -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="{label:'name'}"
          style="width: 80%"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width: 60%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="middle" @click="btnCancel">取 消</el-button>
        <el-button size="middle" type="primary" @click="btnOK">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 5, message: '用户姓名为1-5位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      },
      treeData: [],
      showTree: false,
      loading: false
    }
  },
  methods: {
    // 选择部门的点击事件
    async getDepartments() {
      this.loading = true
      this.showTree = true
      // 获取部门列表数据
      const { depts } = await getDepartments()
      // 转化为树形数据保存
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 确定部门的点击事件
    selectNode(node) {
      // 回写到部门的input中
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 关闭按钮
    btnCancel() {
      this.$emit('update:showDialog', false)
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.formData.resetFields()
    },
    async btnOK() {
      try {
        // 表单验证
        await this.$refs.formData.validate()
        // 发送添加员工请求
        await addEmployee(this.formData)
        // 从父组件调用渲染页面的函数
        await this.$parent.getEmployeesList && this.$parent.getEmployeesList()
        // 提示成功
        this.$message.success('添加成功')
        // 关闭弹层
        this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style></style>
