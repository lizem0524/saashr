<template>
  <div>
    <el-upload
      action="#"
      :limit="1"
      :http-request="upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :class="{disabled:fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width:180px" />
    <el-dialog
      :visible.sync="showDialog"
      title="图片预览"
    >
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import Cos from 'cos-js-sdk-v5'
const cos = new Cos({
  SecretId: 'AKID50f7IDsGOFp9CyUjgMlulLegRv73i6D3',
  SecretKey: 'atwhCQN3TcU4NPAdpkOlrgJJ2UfZCYdR'
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null,
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览的事件
    handlePictureCardPreview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 点击删除的事件
    handleRemove(file, fileList) {
      // this.fileList = fielList
      this.fileList = fileList.map(item => item)
    },
    changeFile(file, fileList) {
      console.log('change')
      this.fileList = fileList
      // this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // 对文件类型校验
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 对文件的大小校验
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload(params) {
      console.log(params.file)
      if (params.file) {
        cos.putObject({
          Bucket: 'lizem-1308017004', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-beijing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: 'ihrm_avatar/' + params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          StorageClass: 'STANDARD',
          Body: params.file, // 上传文件对象
          onProgress: (progressData) => {
            this.percent = progressData.percent * 100
            console.log(progressData)
          }
        }, (err, data) => {
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 找到上传的文件，把url地址改成腾讯云的地址
            // 这种方法不会被element ui监听
            // this.fileList.find(item =>
            //   item.uid === this.currentFileUid
            // ).url = 'http://' + data.Location

            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // this.fileList = [{ url: 'http://' + data.Location, upload: true }]
            // 延迟，显示进度条
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }

  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none;
}
</style>
