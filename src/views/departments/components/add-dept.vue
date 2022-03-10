<template>
  <el-dialog title="新增部门" :visible="showDialog">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" autocomplete="off" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码" style="width:80%" placeholder="1-50个字符">
        <el-input v-model="formData.code" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 遍历选项 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" autocomplete="off" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="middle">取 消</el-button>
      <el-button size="middle" type="primary" @click="btnOK">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/empoyees'
import { addDepartments } from '@/api/departments'
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
      // 筛选出所有子部门，并some查找是否有相同名称
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id)
        .some(item => item.name === value)
        // 如果有相同名称，验证失败，反之成功
      isRepeat ? callback(new Error(`${value}已存在`)) : callback()
    }
    // 检查部门编码是否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 发起请求获取部门数据，解构拿到所有部门的数组
      const { depts } = await getDepartments()
      // 在所有数据中查找是否有相同编码
      const isRepeat = depts.some(item => item.code === value && value)
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
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  methods: {
    // 点击选择负责人时获取最新员工数据，循环渲染表单
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      console.log(res)
      this.peoples = res
    },
    // 点击提交按钮，手动验证表单
    btnOK() {
      this.$refs.formData.validate(async(valid) => {
        // 验证成功
        if (valid) {
          // 把点击的父部门的id设置为要提交的子部门的pid，把pid合并到提交的数据中，
          const data = { ...this.formData, pid: this.treeNode.id }
          await addDepartments(data)
          // 告诉父组件
          this.$emit('submitAddDepts')
          // 验证失败
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style></style>
