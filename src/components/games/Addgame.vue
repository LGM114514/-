<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加资讯</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加资讯信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="300" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="资讯内容"></el-step>
        <el-step title="资讯照片"></el-step>
        <el-step title="资讯作者"></el-step>
        <el-step title="上传时间"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeLeave">
          <el-tab-pane label="基本信息" name="0">

            <el-form-item label="标题" prop="title">
              <el-input v-model="addForm.title"></el-input>
            </el-form-item>

            <el-form-item label="类别" prop="game_cat">
                <el-cascader  expand-trigger="hover"
                  v-model="addForm.game_cat"
                  :options="catelist"
                  :props="cateProps"
                  @change="handleChange"
                  clearable change-on-select>
                </el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="资讯内容" name="1">
            <quill-editor v-model="addForm.game_content"></quill-editor>
          </el-tab-pane>

          <el-tab-pane label="资讯照片" name="2">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="资讯作者" name="3">
            <el-form-item label="作者" prop="author">
              <el-input v-model="addForm.author"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="上传时间" name="4">
            <el-date-picker
              v-model="addForm.createTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>

            <el-button type="primary" class="btnAdd" @click="add">添加资讯</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="33%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>

  </div>
</template>
<script>
import axios from '../../axios'
import _ from 'lodash'
export default {
  data () {
    return {
      uploadURL: 'http://localhost:3000/upload',
      // 请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },

      previewPath: '',
      previewVisible: false,

      activeIndex: '0',
      catelist: [],

      cateProps: {
        value: 'cat_id',
        label: 'cat_Name',
        children: 'children'
      },

      addForm: {
        title: '',
        game_cat: [],
        game_content: '',
        author: '',
        createTime: '',
        pics: []
      },

      addFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 18, message: '标题最多18个字符', trigger: 'blur' }
        ],
        game_cat: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者名字', trigger: 'blur' }
        ]
      }

    }
  },

  created () {
    this.gatCateList()
  },

  methods: {

    async gatCateList () {
      const { data: res } = await axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.catelist = res.data.result
    },

    handleChange () {
      if (this.addForm.game_cat.length !== 3) {
        this.addForm.game_cat = []
      }
    },

    beforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.game_cat.length !== 3) {
        this.$message.error('请选择资讯分类')
        return false
      }
    },

    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },

    handleSuccess (response) {
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },

    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        const form = _.cloneDeep(this.addForm)
        form.game_cat = form.game_cat[2]
        const { data: res } = await axios.post('game_infosheet', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$router.push('/informationlist')
      })
    }
  }

}
</script>

<style lang="less" scoped>
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-left: 10px;
}
</style>
