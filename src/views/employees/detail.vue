<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs value="first">
          <!-- 登录账户设置 -->
          <el-tab-pane label="登录账户设置" name="first">
            <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="35%" style="margin-top: 30px">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px">1</el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="userInfo.password" style="width: 300px" type="password">1</el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 个人详情页 -->
          <el-tab-pane label="个人详情" name="second">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="UserComponent" />
            <!-- <user-info /> -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="third">
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import UserInfo from '@/views/employees//components/user-info.vue'
import JobInfo from '@/views/employees//components/job-info.vue'
import { saveUserDetailById } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
export default {
  components: {
    UserInfo,
    JobInfo },
  data() {
    return {
      UserComponent: 'user-info',
      JobComponent: 'job-info',
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    // 获取用户基本信息
    async getUserDetail() {
      this.userInfo = await getUserDetailById(this.userId)
      // 返回的是加密的密码，因此要双向绑定为空
      this.userInfo.password = ''
    },
    // 提交修改的用户基本信息
    async saveUser() {
      try {
        await this.$refs.userForm.validate()
        await saveUserDetailById(this.userInfo)
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style></style>
