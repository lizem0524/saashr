<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="25%">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码" placeholder="1-50个字符">
        <el-input v-model="formData.code" style="width: 80%" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 遍历选项 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" style="width: 80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="middle" @click="btnCancel">取 消</el-button>
      <el-button size="middle" type="primary" @click="btnOK">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/empoyees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查该部门的子部门名称是否被占用
    const checkNameRepeat = async(rule, value, callback) => {
      // 发起请求获取部门数据，解构拿到所有部门的数组
      const { depts } = await getDepartments()
      let isRepeat = false
      // 如果有id，进入编辑校验
      if (this.formData.id) {
        // 已存在的情况: 所有同级别的部门中有此名称 && 不等于此部门编辑前的名称
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid).some(item => item.name === value) && value !== this.treeNode.name
        isRepeat ? callback(new Error(`同级部门中${value}已存在`)) : callback()
      } else {
        // 添加子部门校验
        // 已存在的情况:筛选出的下级部门中，有此名称
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
        isRepeat ? callback(new Error(`该部门下已存在${value}`)) : callback()
      }
      // 如果有相同名称，验证失败，反之成功
    }
    // 检查部门编码是否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 发起请求获取部门数据，解构拿到所有部门的数组
      const { depts } = await getDepartments()
      let isRepeat = false
      // 如果表单中有id，则进入编辑校验
      if (this.formData.id) {
        // 已存在的情况:value 等于所有部门编码中的某个值 && 不等于当前部门编辑前的编码
        isRepeat = depts.some(item => value && value === item.code && value && value !== this.treeNode.code)
      } else {
        // 添加子部门
        // 已存在的情况:value等于所有部门编码中的某个值
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`${value}已存在`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    // 根据id获取详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    // 调用获取简单员工数据的api，用以循环渲染选择部门负责人表单
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      this.peoples = res
    },
    // 点击提交按钮，手动验证表单
    btnOK() {
      this.$refs.formData.validate(async valid => {
        // 验证成功
        if (valid) {
          if (this.formData.id) {
            // 如果表单数据里有id，说明点的是编辑，此时调用编辑部门接口
            await updateDepartments(this.formData)
          } else {
            // 否则调用新增部门接口
            // 把点击的父部门的id设置为要提交的子部门的pid，把pid合并到提交的数据中，
            // 调用添加部门的api，传入表单数据
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 告诉父组件添加完成，父组件以此重新获取数据，渲染页面
          this.$emit('submitAddDepts')
          // 关闭弹层，用.sync修饰符的方式(通过父组件修改自己的props属性)
          // 确定按钮也会自动调用弹层的close事件
          // 虽然close事件绑定的btnCancel包含以下代码，但因为弹层已经关闭，不会死循环
          this.$emit('update:showDialog', false)
          // 验证失败
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击取消关闭弹层
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 重置表单
      this.$refs.formData.resetFields()
    }
  }
}
</script>

<style></style>
