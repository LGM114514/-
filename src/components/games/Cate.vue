<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row>
            <el-col>
              <el-button type="primary" @click="showAddCate">添加分类</el-button>
            </el-col>
        </el-row>

        <tree-table class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border>
          <template slot="isok"><i class="el-icon-success" style="color: lightgreen;"></i></template>
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <template slot="opt">
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          </template>
        </tree-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      width="50%" @close="addCateDialogClosed">
      <!-- 分类表单 -->
      <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFromRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader expand-trigger="hover"
            v-model="seletedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChaned"
            clearable change-on-select>
          </el-cascader>
        </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '../../axios'
export default {
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 2
      },
      columns: [{
        label: '分类名称',
        prop: 'cat_Name'
      },
      {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],

      addCateVisible: false,
      total: 0,
      catelist: [],

      // 父级分类
      parentCateList: [],
      seletedKeys: [],

      cascaderProps: {
        value: 'cat_id',
        label: 'cat_Name',
        children: 'children'
      },

      // 表单数据对象
      addCateFrom: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },

      // 表单验证
      addCateFromRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.catelist = res.data.result
      this.total = res.data.total
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    showAddCate () {
      this.getParentCateList()
      this.addCateVisible = true
    },

    async getParentCateList () {
      const { data: res } = await axios.get('parentCateList')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.parentCateList = res.data.result
    },

    parentCateChaned () {
      // console.log(this.seletedKeys)
      if (this.seletedKeys.length > 0) {
        this.addCateFrom.cat_pid = this.seletedKeys[this.seletedKeys.length - 1]
        // 分类等级
        this.addCateFrom.cat_level = this.seletedKeys.length
        // return
      } else {
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
      if (this.seletedKeys.length === 3) {
        this.seletedKeys = []
      }
    },

    addCate () {
      this.$refs.addCateFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await axios.post('categories', this.addCateFrom)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.addCateVisible = false
        this.getCateList()
      })
    },

    addCateDialogClosed () {
      this.$refs.addCateFromRef.resetFields()
      this.seletedKeys = []
      this.addCateFrom.cat_pid = 0
      this.addCateFrom.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
