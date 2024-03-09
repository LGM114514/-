<template>
    <div>
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item>资讯列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getGamesList"  clearable>
                <el-button slot="append" icon="el-icon-search" @click="getGamesList"></el-button>
                </el-input>
                </el-col>
                <el-col :span="4">
                <el-button type="primary" @click="goAddGame">添加资讯</el-button>
                </el-col>
            </el-row>
        </el-card>

      <el-table :data="gameslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
          <el-table-column
            prop="title"
            label="标题" width="200px">
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="上传时间" width="160px">
            <template slot-scope="scope">
              {{scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
            prop="author"
            label="作者" width="95px">
          </el-table-column>
          <el-table-column
            label="操作" width="130px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.gid)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" background>
        </el-pagination>
    </div>
</template>
<script>
import axios from '../../axios'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },

      gameslist: [],
      total: 0
    }
  },
  created () {
    this.getGamesList()
  },
  methods: {
    async getGamesList () {
      const { data: res } = await axios.get('gamelist', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取资讯列表失败')
      this.gameslist = res.data.gamelist
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGamesList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGamesList()
    },
    async removeById (gid) {
      const confirmResuiit = await this.$confirm('此操作将永久删除该资讯, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResuiit !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await axios.delete(`delgame/${gid}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getGamesList()
    },
    goAddGame () {
      this.$router.push('/informationlist/add')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
