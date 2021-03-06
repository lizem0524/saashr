<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-loading="loading" value="first">
          <el-tab-pane label="角色管理" name="first">
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" type="primary" size="small" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <el-table
              style="width: 100%"
              border=""
              :data="list"
            >
              <el-table-column align="center" label="序号" width="60" type="index" />
              <el-table-column align="center" label="角色名" prop="name" min-width="20" />
              <el-table-column align="center" label="描述" prop="description" min-width="45" />
              <el-table-column align="center" label="操作" min-width="20">
                <!-- 操作单元格 -->
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination
                background
                :current-page="page.page"
                :page-size="page.pagesize"
                layout="prev, pager, next"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 右侧公司信息 -->
          <el-tab-pane label="公司信息" name="second">
            <!-- 上方警告 -->
            <el-alert
              :show-icon="true"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              :closable="false"
              type="info"
            />
            <!-- 公司信息表单 -->
            <el-form style="margin-top:50px" label-width="20%">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled type="textarea" :row="3" style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增或编辑弹层组件 -->
    <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="25%">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width:80%" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" style="width:80%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="middle" @click="btnCancel">取 消</el-button>
        <el-button size="middle" type="primary" @click="btnOK">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限分配弹层 -->
    <el-dialog
      title="权限分配"
      :visible.sync="showPermDialog"
      @close="btnPermCancel"
    >
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        node-key="id"
        :default-checked-keys="selectCheckedList"
        show-checkbox
        check-strictly
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="btnPermCancel">取 消</el-button>
        <el-button type="primary" @click="btnPermOK">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting.js'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 页面角色数据
      page: {
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数据
      },
      showDialog: false,
      roleForm: { // 根据id获取的角色的数据
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      loading: false,
      permData: [], // 接收权限数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      roleId: null, // 记录谁要分配权限
      showPermDialog: false, // 权限弹层开关
      formData: {}, // 右侧公司数据
      selectCheckedList: []
    }
  },
  computed: {
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    },
    ...mapGetters(['companyId'])
  },
  created() {
    // 调用渲染的方法
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 封装获取角色数据渲染页面的方法
    async getRoleList() {
      this.loading = true
      const { total, rows } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    // 点击分页触发的el事件
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 封装获取公司数据的方法
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.companyId)
      this.formData = res
    },
    // 删除角色的事件
    async deleteRole(id) {
      try {
        await this.$confirm('确定删除该角色吗？')
        console.log('1')
        // 调用删除接口
        await deleteRole(id)
        // 重新渲染页面
        this.getRoleList()
        this.$message.success('删除角色成功')
        // 点击取消按钮会抛出异常，可用catch接收
      } catch (error) {
        // this.$message.error(error)
      }
    },
    // 点击编辑按钮触发
    async editRole(id) {
      // 调用获取角色详情的接口，数据回写
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
      // 获取员工的详情信息并渲染表单
    },
    // 添加和编辑弹层的确定按钮
    async btnOK() {
      try {
        // 手动表单校验
        await this.$refs.roleForm.validate()
        // 判断是否为编辑
        if (this.roleForm.id) {
          // 调用更新数据的接口
          await updateRole(this.roleForm)
          // 提示修改成功
          this.$message.success('修改成功')
        } else {
          // 调用新增接口
          await addRole(this.roleForm)
          this.$message.success('添加成功')
        }
        // 关闭弹层
        this.showDialog = false
        // 重新拉取数据
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    // 添加和编辑弹层的取消按钮
    btnCancel() {
      // 关闭弹层
      this.showDialog = false
      // 清空数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 清空数据和校验数据
      this.$refs.roleForm.resetFields()
    },
    // 点击分配权限后
    async assignPerm(id) {
      // 获取全部权限，转化树形并渲染
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      // 获取该角色的已有权限
      const { permIds } = await getRoleDetail(id)
      // 把该角色的已有权限默认勾选
      this.selectCheckedList = permIds
      this.roleId = id
      this.showPermDialog = true
    },
    // 分配权限弹层的取消按钮事件
    btnPermCancel() {
      this.roleId = null
      this.selectCheckedList = []
      this.showPermDialog = false
    },
    // 分配权限弹层的确定按钮事件
    async btnPermOK() {
      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() }) // 拿到当前已checked的复选框的数组
      this.$message.success('权限分配成功')
      this.showPermDialog = false
    }
  }
}
</script>

<style>
</style>
